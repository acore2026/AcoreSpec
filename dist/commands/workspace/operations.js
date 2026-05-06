import * as nodeFs from 'node:fs';
import * as path from 'node:path';
import { getManagedWorkspaceRoot, getWorkspaceChangesDir, getWorkspacePortableIgnorePatterns, isWorkspaceRoot, parseWorkspaceSetupLinkInput, readOptionalWorkspaceLocalState, readWorkspaceRegistryState, readWorkspaceSharedState, validateWorkspaceLinkName, validateWorkspaceName, writeWorkspaceLocalState, writeWorkspaceRegistryState, writeWorkspaceSharedState, } from '../../core/workspace/index.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { WorkspaceCliError, asErrorMessage, makeStatus, } from './types.js';
const fs = nodeFs.promises;
function emptyRegistry() {
    return { version: 1, workspaces: {} };
}
function emptyLocalState() {
    return { version: 1, paths: {} };
}
export async function readRegistry() {
    return (await readWorkspaceRegistryState()) ?? emptyRegistry();
}
async function recordWorkspaceInRegistry(name, workspaceRoot) {
    const registry = await readRegistry();
    const recordedWorkspaceRoot = normalizeExistingPathForStorage(workspaceRoot);
    await writeWorkspaceRegistryState({
        version: 1,
        workspaces: {
            ...registry.workspaces,
            [name]: recordedWorkspaceRoot,
        },
    });
}
export async function directoryExists(dirPath) {
    try {
        return (await fs.stat(dirPath)).isDirectory();
    }
    catch {
        return false;
    }
}
async function fileExists(filePath) {
    try {
        return (await fs.stat(filePath)).isFile();
    }
    catch {
        return false;
    }
}
function normalizeExistingPathForStorage(existingPath) {
    return process.platform === 'win32'
        ? FileSystemUtils.canonicalizeExistingPath(existingPath)
        : existingPath;
}
export async function resolveExistingDirectory(inputPath, cwd = process.cwd()) {
    if (inputPath.length === 0) {
        throw new WorkspaceCliError('Repo or folder path must not be empty.', 'linked_path_empty', {
            target: 'link.path',
            fix: 'Choose an existing repo or folder path.',
        });
    }
    const resolvedPath = path.isAbsolute(inputPath)
        ? path.resolve(inputPath)
        : path.resolve(cwd, inputPath);
    if (!(await directoryExists(resolvedPath))) {
        throw new WorkspaceCliError(`Path '${inputPath}' is not an existing folder.`, 'linked_path_missing', {
            target: 'link.path',
            fix: 'Choose an existing repo or folder path.',
        });
    }
    return normalizeExistingPathForStorage(resolvedPath);
}
export function inferLinkName(absolutePath) {
    return path.basename(absolutePath);
}
function normalizeLinksForOutput(sharedState, localState) {
    return Object.keys(sharedState.links)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({
        name,
        path: localState?.paths[name] ?? null,
        status: [],
    }));
}
function formatDuplicateLinkMessage(linkName, existingPath, replacementPath) {
    return [
        `Cannot use link name '${linkName}' because another link already uses that name.`,
        'Existing link:',
        `  ${linkName} -> ${existingPath ?? '(no local path recorded)'}`,
        '',
        'Choose a different link name:',
        `  openspec workspace link archived-${linkName} ${replacementPath}`,
        '',
        'If you meant to change the existing link path:',
        `  openspec workspace relink ${linkName} ${replacementPath}`,
    ].join('\n');
}
function duplicateLinkError(linkName, existingPath, replacementPath) {
    return new WorkspaceCliError(formatDuplicateLinkMessage(linkName, existingPath, replacementPath), 'duplicate_link_name', {
        target: `links.${linkName}`,
        fix: `Choose a different link name or run 'openspec workspace relink ${linkName} ${replacementPath}'.`,
    });
}
function duplicateSetupLinkError(linkName, existingPath, replacementPath) {
    return new WorkspaceCliError([
        `Cannot use link name '${linkName}' because another setup link already uses that name.`,
        'Existing link:',
        `  ${linkName} -> ${existingPath}`,
        '',
        'Use explicit --link <name>=<path> values with different names.',
    ].join('\n'), 'duplicate_link_name', {
        target: `links.${linkName}`,
        fix: `Use explicit --link ${linkName}-alt=${replacementPath} with a different link name.`,
    });
}
export function validateWorkspaceNameForSetup(name) {
    try {
        return validateWorkspaceName(name);
    }
    catch {
        throw new WorkspaceCliError('Workspace name must be kebab-case with lowercase letters, numbers, and single hyphen separators.', 'invalid_workspace_name', {
            target: 'workspace.name',
        });
    }
}
export function validateLinkNameForCommand(name) {
    try {
        return validateWorkspaceLinkName(name);
    }
    catch (error) {
        throw new WorkspaceCliError(asErrorMessage(error), 'invalid_link_name', {
            target: 'link.name',
        });
    }
}
function localStateInvalidStatus(error) {
    return makeStatus('error', 'workspace_local_state_invalid', `Machine-local paths could not be read: ${asErrorMessage(error)}`, {
        target: 'workspace.local_state',
        fix: 'Repair or remove .openspec-workspace/local.yaml, then run openspec workspace relink <name> <path> for affected links.',
    });
}
async function readLocalStateForMutation(workspaceRoot) {
    try {
        return (await readOptionalWorkspaceLocalState(workspaceRoot)) ?? emptyLocalState();
    }
    catch (error) {
        const status = localStateInvalidStatus(error);
        throw new WorkspaceCliError(status.message, status.code, {
            target: status.target,
            fix: status.fix,
        });
    }
}
async function ensureWorkspaceGitignore(workspaceRoot) {
    const gitignorePath = path.join(workspaceRoot, '.gitignore');
    const patterns = getWorkspacePortableIgnorePatterns();
    const existingContent = (await fileExists(gitignorePath))
        ? await fs.readFile(gitignorePath, 'utf-8')
        : '';
    const existingLines = new Set(existingContent
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter((line) => line.length > 0));
    const missingPatterns = patterns.filter((pattern) => !existingLines.has(pattern));
    if (missingPatterns.length === 0) {
        return;
    }
    const prefix = existingContent.length > 0 && !existingContent.endsWith('\n') ? '\n' : '';
    const content = `${existingContent}${prefix}${missingPatterns.join('\n')}\n`;
    await fs.writeFile(gitignorePath, content, 'utf-8');
}
export async function createManagedWorkspace(name, links) {
    const workspaceName = validateWorkspaceNameForSetup(name);
    const workspaceRoot = getManagedWorkspaceRoot(workspaceName);
    const registry = await readRegistry();
    if (registry.workspaces[workspaceName]) {
        throw new WorkspaceCliError(`Workspace '${workspaceName}' is already recorded in the local workspace registry at ${registry.workspaces[workspaceName]}.`, 'workspace_already_exists', {
            target: 'workspace.name',
        });
    }
    if (await directoryExists(workspaceRoot)) {
        throw new WorkspaceCliError(`Workspace '${workspaceName}' already exists at ${workspaceRoot}.`, 'workspace_already_exists', {
            target: 'workspace.root',
        });
    }
    let createdWorkspaceRoot = false;
    try {
        await FileSystemUtils.createDirectory(path.dirname(workspaceRoot));
        await fs.mkdir(workspaceRoot);
        createdWorkspaceRoot = true;
        await FileSystemUtils.createDirectory(getWorkspaceChangesDir(workspaceRoot));
        await writeWorkspaceSharedState(workspaceRoot, {
            version: 1,
            name: workspaceName,
            links: Object.fromEntries(Object.keys(links).map((linkName) => [linkName, {}])),
        });
        await writeWorkspaceLocalState(workspaceRoot, {
            version: 1,
            paths: links,
        });
        await ensureWorkspaceGitignore(workspaceRoot);
        await recordWorkspaceInRegistry(workspaceName, workspaceRoot);
    }
    catch (error) {
        if (createdWorkspaceRoot) {
            try {
                await fs.rm(workspaceRoot, { recursive: true, force: true });
            }
            catch {
                // Preserve the original creation failure; callers can retry or inspect the path.
            }
        }
        throw new WorkspaceCliError(`Could not create workspace '${workspaceName}': ${asErrorMessage(error)}`, 'workspace_create_failed', {
            target: 'workspace.root',
        });
    }
    return {
        name: workspaceName,
        root: workspaceRoot,
        planning_path: getWorkspaceChangesDir(workspaceRoot),
        links: Object.entries(links)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([linkName, linkPath]) => ({
            name: linkName,
            path: linkPath,
            status: [],
        })),
        status: [],
    };
}
export async function parseSetupLinks(linkInputs) {
    const links = {};
    for (const rawLink of linkInputs ?? []) {
        const parsed = await parseWorkspaceSetupLinkInput(rawLink);
        const resolvedPath = await resolveExistingDirectory(parsed.pathInput);
        const linkName = validateLinkNameForCommand(parsed.name ?? inferLinkName(resolvedPath));
        if (links[linkName]) {
            throw duplicateSetupLinkError(linkName, links[linkName], resolvedPath);
        }
        links[linkName] = resolvedPath;
    }
    return links;
}
export async function loadWorkspaceForList(entry) {
    const workspaceStatus = [];
    if (!(await directoryExists(entry.workspaceRoot)) || !(await isWorkspaceRoot(entry.workspaceRoot))) {
        return {
            name: entry.name,
            root: entry.workspaceRoot,
            links: [],
            status: [
                makeStatus('error', 'workspace_root_missing', 'Workspace location does not exist.', {
                    target: 'workspace.root',
                    fix: 'Remove or repair the local registry record.',
                }),
            ],
        };
    }
    let sharedState;
    let localState = null;
    try {
        sharedState = await readWorkspaceSharedState(entry.workspaceRoot);
    }
    catch (error) {
        return {
            name: entry.name,
            root: entry.workspaceRoot,
            links: [],
            status: [
                makeStatus('error', 'workspace_state_invalid', `Workspace state could not be read: ${asErrorMessage(error)}`, {
                    target: 'workspace.root',
                    fix: 'Repair the workspace state files before using this workspace.',
                }),
            ],
        };
    }
    try {
        localState = await readOptionalWorkspaceLocalState(entry.workspaceRoot);
    }
    catch (error) {
        workspaceStatus.push(localStateInvalidStatus(error));
    }
    return {
        name: sharedState.name,
        root: entry.workspaceRoot,
        links: normalizeLinksForOutput(sharedState, localState),
        status: workspaceStatus,
    };
}
export async function loadWorkspaceForDoctor(selected) {
    const commandStatus = [...selected.status];
    const workspaceStatus = [];
    const planningPath = getWorkspaceChangesDir(selected.root);
    if (!(await directoryExists(selected.root)) || !(await isWorkspaceRoot(selected.root))) {
        return {
            workspace: {
                name: selected.name,
                root: selected.root,
                planning_path: planningPath,
                links: [],
                status: [
                    makeStatus('error', 'selected_workspace_root_missing', 'Selected workspace location does not exist or is not a valid workspace.', {
                        target: 'workspace.root',
                        fix: 'Repair the local workspace registry record or choose another workspace.',
                    }),
                ],
            },
            status: commandStatus,
        };
    }
    let sharedState;
    let localState;
    let localStateInvalid = false;
    try {
        sharedState = await readWorkspaceSharedState(selected.root);
    }
    catch (error) {
        return {
            workspace: {
                name: selected.name,
                root: selected.root,
                planning_path: planningPath,
                links: [],
                status: [
                    makeStatus('error', 'workspace_state_invalid', `Workspace state could not be read: ${asErrorMessage(error)}`, {
                        target: 'workspace.root',
                        fix: 'Repair .openspec-workspace/workspace.yaml before using this workspace.',
                    }),
                ],
            },
            status: commandStatus,
        };
    }
    try {
        const optionalLocalState = await readOptionalWorkspaceLocalState(selected.root);
        localState = optionalLocalState ?? emptyLocalState();
        if (!optionalLocalState) {
            workspaceStatus.push(makeStatus('warning', 'workspace_local_state_missing', 'Machine-local paths are not recorded yet.', {
                target: 'workspace.local_state',
                fix: 'Run openspec workspace relink <name> <path> for each linked repo or folder on this machine.',
            }));
        }
    }
    catch (error) {
        localState = emptyLocalState();
        localStateInvalid = true;
        workspaceStatus.push(localStateInvalidStatus(error));
    }
    if (!(await directoryExists(planningPath))) {
        workspaceStatus.push(makeStatus('error', 'workspace_planning_path_missing', 'Workspace planning path does not exist.', {
            target: 'workspace.planning_path',
            fix: `Create ${planningPath} or recreate the workspace with openspec workspace setup.`,
        }));
    }
    const sharedNames = new Set(Object.keys(sharedState.links));
    const localNames = new Set(Object.keys(localState.paths));
    const linkNames = [...new Set([...sharedNames, ...localNames])].sort((a, b) => a.localeCompare(b));
    const links = [];
    for (const linkName of linkNames) {
        const linkStatus = [];
        const localPath = localState.paths[linkName] ?? null;
        let repoSpecsPath = null;
        if (!sharedNames.has(linkName)) {
            linkStatus.push(makeStatus('warning', 'local_path_without_shared_link', 'Local path is recorded without a shared workspace link.', {
                target: `links.${linkName}`,
                fix: `Add a shared link with openspec workspace link ${linkName} ${localPath ?? '/path/to/folder'} or remove the local-only path from .openspec-workspace/local.yaml.`,
            }));
        }
        if (sharedNames.has(linkName) && !localPath && !localStateInvalid) {
            linkStatus.push(makeStatus('error', 'linked_path_missing_from_local_state', 'Shared link does not have a local path on this machine.', {
                target: `links.${linkName}.path`,
                fix: `openspec workspace relink ${linkName} /path/to/${linkName}`,
            }));
        }
        if (localPath) {
            if (await directoryExists(localPath)) {
                const candidateSpecsPath = path.join(localPath, 'openspec', 'specs');
                repoSpecsPath = (await directoryExists(candidateSpecsPath)) ? candidateSpecsPath : null;
            }
            else {
                linkStatus.push(makeStatus('error', 'linked_path_missing', 'Linked path does not exist.', {
                    target: `links.${linkName}.path`,
                    fix: `openspec workspace relink ${linkName} /path/to/${linkName}`,
                }));
            }
        }
        links.push({
            name: linkName,
            path: localPath,
            repo_specs_path: repoSpecsPath,
            status: linkStatus,
        });
    }
    return {
        workspace: {
            name: sharedState.name,
            root: selected.root,
            planning_path: planningPath,
            links,
            status: workspaceStatus,
        },
        status: commandStatus,
    };
}
async function readWorkspaceForMutation(selected) {
    if (!(await directoryExists(selected.root)) || !(await isWorkspaceRoot(selected.root))) {
        throw new WorkspaceCliError(`Workspace location does not exist for '${selected.name}': ${selected.root}`, 'selected_workspace_root_missing', {
            target: 'workspace.root',
            fix: 'Run openspec workspace list to inspect known workspaces.',
        });
    }
    return {
        sharedState: await readWorkspaceSharedState(selected.root),
        localState: await readLocalStateForMutation(selected.root),
    };
}
async function recordSelectedWorkspaceAfterMutation(selected) {
    if (selected.unregisteredCurrentWorkspace) {
        await recordWorkspaceInRegistry(selected.name, selected.root);
    }
}
function buildLinkMutationPayload(selected, sharedState, localState, linkName, linkPath) {
    return {
        workspace: {
            name: sharedState.name,
            root: selected.root,
            planning_path: getWorkspaceChangesDir(selected.root),
            links: normalizeLinksForOutput(sharedState, localState),
            status: [],
        },
        link: {
            name: linkName,
            path: linkPath,
            status: [],
        },
        status: selected.status,
    };
}
export async function addWorkspaceLink(selected, nameOrPath, linkPath) {
    const explicitName = linkPath ? nameOrPath : undefined;
    const pathInput = linkPath ?? nameOrPath;
    const resolvedPath = await resolveExistingDirectory(pathInput);
    const linkName = validateLinkNameForCommand(explicitName ?? inferLinkName(resolvedPath));
    const { sharedState, localState } = await readWorkspaceForMutation(selected);
    if (sharedState.links[linkName]) {
        throw duplicateLinkError(linkName, localState.paths[linkName] ?? null, resolvedPath);
    }
    const updatedSharedState = {
        ...sharedState,
        links: {
            ...sharedState.links,
            [linkName]: {},
        },
    };
    const updatedLocalState = {
        version: 1,
        paths: {
            ...localState.paths,
            [linkName]: resolvedPath,
        },
    };
    await writeWorkspaceSharedState(selected.root, updatedSharedState);
    await writeWorkspaceLocalState(selected.root, updatedLocalState);
    await recordSelectedWorkspaceAfterMutation(selected);
    return buildLinkMutationPayload(selected, updatedSharedState, updatedLocalState, linkName, resolvedPath);
}
export async function updateWorkspaceLink(selected, linkNameInput, linkPath) {
    const linkName = validateLinkNameForCommand(linkNameInput);
    const resolvedPath = await resolveExistingDirectory(linkPath);
    const { sharedState, localState } = await readWorkspaceForMutation(selected);
    if (!sharedState.links[linkName]) {
        throw new WorkspaceCliError(`Unknown workspace link '${linkName}'.`, 'unknown_link_name', {
            target: `links.${linkName}`,
            fix: 'Run openspec workspace doctor to see linked repos or folders.',
        });
    }
    const updatedLocalState = {
        version: 1,
        paths: {
            ...localState.paths,
            [linkName]: resolvedPath,
        },
    };
    await writeWorkspaceLocalState(selected.root, updatedLocalState);
    await recordSelectedWorkspaceAfterMutation(selected);
    return buildLinkMutationPayload(selected, sharedState, updatedLocalState, linkName, resolvedPath);
}
//# sourceMappingURL=operations.js.map