import { WorkspaceRegistryEntry, WorkspaceRegistryState } from '../../core/workspace/index.js';
import { SelectedWorkspace, WorkspaceLinkMutationPayload, WorkspaceListOutput, WorkspaceOutput, WorkspaceStatus } from './types.js';
export declare function readRegistry(): Promise<WorkspaceRegistryState>;
export declare function directoryExists(dirPath: string): Promise<boolean>;
export declare function resolveExistingDirectory(inputPath: string, cwd?: string): Promise<string>;
export declare function inferLinkName(absolutePath: string): string;
export declare function validateWorkspaceNameForSetup(name: string): string;
export declare function validateLinkNameForCommand(name: string): string;
export declare function createManagedWorkspace(name: string, links: Record<string, string>): Promise<WorkspaceOutput>;
export declare function parseSetupLinks(linkInputs: string[] | undefined): Promise<Record<string, string>>;
export declare function loadWorkspaceForList(entry: WorkspaceRegistryEntry): Promise<WorkspaceListOutput>;
export declare function loadWorkspaceForDoctor(selected: SelectedWorkspace): Promise<{
    workspace: WorkspaceOutput;
    status: WorkspaceStatus[];
}>;
export declare function addWorkspaceLink(selected: SelectedWorkspace, nameOrPath: string, linkPath?: string): Promise<WorkspaceLinkMutationPayload>;
export declare function updateWorkspaceLink(selected: SelectedWorkspace, linkNameInput: string, linkPath: string): Promise<WorkspaceLinkMutationPayload>;
//# sourceMappingURL=operations.d.ts.map