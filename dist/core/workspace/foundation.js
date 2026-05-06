import * as nodeFs from 'node:fs';
import * as path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { z } from 'zod';
import { getGlobalDataDir } from '../global-config.js';
import { FileSystemUtils } from '../../utils/file-system.js';
const fs = nodeFs.promises;
export const WORKSPACE_METADATA_DIR_NAME = '.openspec-workspace';
export const WORKSPACE_SHARED_STATE_FILE_NAME = 'workspace.yaml';
export const WORKSPACE_LOCAL_STATE_FILE_NAME = 'local.yaml';
export const WORKSPACE_CHANGES_DIR_NAME = 'changes';
export const MANAGED_WORKSPACES_DIR_NAME = 'workspaces';
export const WORKSPACE_REGISTRY_FILE_NAME = 'registry.yaml';
export const WORKSPACE_LOCAL_STATE_IGNORE_PATTERN = `${WORKSPACE_METADATA_DIR_NAME}/${WORKSPACE_LOCAL_STATE_FILE_NAME}`;
function joinWorkspacePath(basePath, ...segments) {
    return FileSystemUtils.joinPath(basePath, ...segments);
}
export function getWorkspaceMetadataDir(workspaceRoot) {
    return joinWorkspacePath(workspaceRoot, WORKSPACE_METADATA_DIR_NAME);
}
export function getWorkspaceSharedStatePath(workspaceRoot) {
    return joinWorkspacePath(getWorkspaceMetadataDir(workspaceRoot), WORKSPACE_SHARED_STATE_FILE_NAME);
}
export function getWorkspaceLocalStatePath(workspaceRoot) {
    return joinWorkspacePath(getWorkspaceMetadataDir(workspaceRoot), WORKSPACE_LOCAL_STATE_FILE_NAME);
}
export function getWorkspaceChangesDir(workspaceRoot) {
    return joinWorkspacePath(workspaceRoot, WORKSPACE_CHANGES_DIR_NAME);
}
export function getManagedWorkspacesDir(options = {}) {
    return joinWorkspacePath(options.globalDataDir ?? getGlobalDataDir(), MANAGED_WORKSPACES_DIR_NAME);
}
export function getManagedWorkspaceRoot(workspaceName, options = {}) {
    validateWorkspaceName(workspaceName);
    return joinWorkspacePath(getManagedWorkspacesDir(options), workspaceName);
}
export function getWorkspaceRegistryPath(options = {}) {
    return joinWorkspacePath(getManagedWorkspacesDir(options), WORKSPACE_REGISTRY_FILE_NAME);
}
export function getWorkspacePortableIgnorePatterns() {
    return [WORKSPACE_LOCAL_STATE_IGNORE_PATTERN];
}
function validateFolderStyleName(name, label) {
    if (name.length === 0) {
        throw new Error(`${label} must not be empty`);
    }
    if (name === '.' || name === '..') {
        throw new Error(`${label} must not be '${name}'`);
    }
    if (/[\\/]/u.test(name)) {
        throw new Error(`${label} must not contain path separators`);
    }
    return name;
}
export function validateWorkspaceName(name) {
    validateFolderStyleName(name, 'Workspace name');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
        throw new Error('Workspace name must be kebab-case with lowercase letters, numbers, and single hyphen separators');
    }
    return name;
}
export function validateWorkspaceLinkName(name) {
    return validateFolderStyleName(name, 'Workspace link name');
}
export function isValidWorkspaceName(name) {
    try {
        validateWorkspaceName(name);
        return true;
    }
    catch {
        return false;
    }
}
export function isValidWorkspaceLinkName(name) {
    try {
        validateWorkspaceLinkName(name);
        return true;
    }
    catch {
        return false;
    }
}
async function pathIsFile(filePath) {
    try {
        return (await fs.stat(filePath)).isFile();
    }
    catch {
        return false;
    }
}
async function pathIsDirectory(dirPath) {
    try {
        return (await fs.stat(dirPath)).isDirectory();
    }
    catch {
        return false;
    }
}
export async function isWorkspaceRoot(candidateRoot) {
    return pathIsFile(getWorkspaceSharedStatePath(candidateRoot));
}
async function getSearchStartDirectory(startPath) {
    const resolvedStart = path.resolve(startPath);
    try {
        const stats = await fs.stat(resolvedStart);
        return stats.isDirectory() ? resolvedStart : path.dirname(resolvedStart);
    }
    catch {
        return resolvedStart;
    }
}
export async function findWorkspaceRoot(startPath = process.cwd()) {
    let currentDir = await getSearchStartDirectory(startPath);
    while (true) {
        if (await isWorkspaceRoot(currentDir)) {
            return process.platform === 'win32'
                ? FileSystemUtils.canonicalizeExistingPath(currentDir)
                : currentDir;
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        currentDir = parentDir;
    }
}
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const PlainObjectSchema = z.custom(isPlainObject, {
    message: 'must be an object',
});
const SharedStateSchema = z.object({
    version: z.literal(1),
    name: z.string(),
    links: z.record(z.string(), PlainObjectSchema),
}).strict();
const LocalStateSchema = z.object({
    version: z.literal(1),
    paths: z.record(z.string(), z.string()),
}).strict();
const RegistryStateSchema = z.object({
    version: z.literal(1),
    workspaces: z.record(z.string(), z.string()),
}).strict();
function formatZodIssues(error) {
    return error.issues
        .map((issue) => {
        const location = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `${location}: ${issue.message}`;
    })
        .join('; ');
}
function parseYamlObject(content, label) {
    try {
        return parseYaml(content);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid ${label}: ${message}`);
    }
}
function assertValidMapKeys(keys, validator, label) {
    for (const key of keys) {
        try {
            validator(key);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid ${label} '${key}': ${message}`);
        }
    }
}
export function parseWorkspaceSharedState(content) {
    const raw = parseYamlObject(content, 'workspace shared state');
    const result = SharedStateSchema.safeParse(raw);
    if (!result.success) {
        throw new Error(`Invalid workspace shared state: ${formatZodIssues(result.error)}`);
    }
    validateWorkspaceName(result.data.name);
    assertValidMapKeys(Object.keys(result.data.links), validateWorkspaceLinkName, 'workspace link name');
    return {
        version: 1,
        name: result.data.name,
        links: result.data.links,
    };
}
export function parseWorkspaceLocalState(content) {
    const raw = parseYamlObject(content, 'workspace local state');
    const result = LocalStateSchema.safeParse(raw);
    if (!result.success) {
        throw new Error(`Invalid workspace local state: ${formatZodIssues(result.error)}`);
    }
    assertValidMapKeys(Object.keys(result.data.paths), validateWorkspaceLinkName, 'workspace local path name');
    return {
        version: 1,
        paths: result.data.paths,
    };
}
export function parseWorkspaceRegistryState(content) {
    const raw = parseYamlObject(content, 'workspace registry state');
    const result = RegistryStateSchema.safeParse(raw);
    if (!result.success) {
        throw new Error(`Invalid workspace registry state: ${formatZodIssues(result.error)}`);
    }
    assertValidMapKeys(Object.keys(result.data.workspaces), validateWorkspaceName, 'workspace registry name');
    return {
        version: 1,
        workspaces: result.data.workspaces,
    };
}
export function serializeWorkspaceSharedState(state) {
    validateWorkspaceName(state.name);
    assertValidMapKeys(Object.keys(state.links), validateWorkspaceLinkName, 'workspace link name');
    for (const [linkName, linkState] of Object.entries(state.links)) {
        if (!isPlainObject(linkState)) {
            throw new Error(`Invalid workspace link '${linkName}': link state must be an object`);
        }
    }
    return stringifyYaml({
        version: 1,
        name: state.name,
        links: state.links,
    });
}
export function serializeWorkspaceLocalState(state) {
    assertValidMapKeys(Object.keys(state.paths), validateWorkspaceLinkName, 'workspace local path name');
    for (const [linkName, localPath] of Object.entries(state.paths)) {
        if (typeof localPath !== 'string') {
            throw new Error(`Invalid workspace local path '${linkName}': path must be a string`);
        }
    }
    return stringifyYaml({
        version: 1,
        paths: state.paths,
    });
}
export function serializeWorkspaceRegistryState(state) {
    assertValidMapKeys(Object.keys(state.workspaces), validateWorkspaceName, 'workspace registry name');
    for (const [workspaceName, workspaceRoot] of Object.entries(state.workspaces)) {
        if (typeof workspaceRoot !== 'string') {
            throw new Error(`Invalid workspace registry entry '${workspaceName}': path must be a string`);
        }
    }
    return stringifyYaml({
        version: 1,
        workspaces: state.workspaces,
    });
}
export function listWorkspaceRegistryEntries(registry) {
    return Object.entries(registry.workspaces)
        .map(([name, workspaceRoot]) => ({ name, workspaceRoot }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
export async function readWorkspaceSharedState(workspaceRoot) {
    return parseWorkspaceSharedState(await fs.readFile(getWorkspaceSharedStatePath(workspaceRoot), 'utf-8'));
}
export async function readWorkspaceLocalState(workspaceRoot) {
    return parseWorkspaceLocalState(await fs.readFile(getWorkspaceLocalStatePath(workspaceRoot), 'utf-8'));
}
function isFileNotFoundError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ENOENT');
}
export async function readOptionalWorkspaceLocalState(workspaceRoot) {
    try {
        return await readWorkspaceLocalState(workspaceRoot);
    }
    catch (error) {
        if (isFileNotFoundError(error)) {
            return null;
        }
        throw error;
    }
}
export async function writeWorkspaceSharedState(workspaceRoot, state) {
    await FileSystemUtils.writeFile(getWorkspaceSharedStatePath(workspaceRoot), serializeWorkspaceSharedState(state));
}
export async function writeWorkspaceLocalState(workspaceRoot, state) {
    await FileSystemUtils.writeFile(getWorkspaceLocalStatePath(workspaceRoot), serializeWorkspaceLocalState(state));
}
export async function readWorkspaceRegistryState(options = {}) {
    const registryPath = getWorkspaceRegistryPath(options);
    if (!(await pathIsFile(registryPath))) {
        return null;
    }
    return parseWorkspaceRegistryState(await fs.readFile(registryPath, 'utf-8'));
}
export async function writeWorkspaceRegistryState(state, options = {}) {
    await FileSystemUtils.writeFile(getWorkspaceRegistryPath(options), serializeWorkspaceRegistryState(state));
}
export async function workspaceChangesDirExists(workspaceRoot) {
    return pathIsDirectory(getWorkspaceChangesDir(workspaceRoot));
}
//# sourceMappingURL=foundation.js.map