export declare const WORKSPACE_METADATA_DIR_NAME = ".openspec-workspace";
export declare const WORKSPACE_SHARED_STATE_FILE_NAME = "workspace.yaml";
export declare const WORKSPACE_LOCAL_STATE_FILE_NAME = "local.yaml";
export declare const WORKSPACE_CHANGES_DIR_NAME = "changes";
export declare const MANAGED_WORKSPACES_DIR_NAME = "workspaces";
export declare const WORKSPACE_REGISTRY_FILE_NAME = "registry.yaml";
export declare const WORKSPACE_LOCAL_STATE_IGNORE_PATTERN = ".openspec-workspace/local.yaml";
export interface WorkspaceSharedState {
    version: 1;
    name: string;
    links: Record<string, WorkspaceLinkState>;
}
export type WorkspaceLinkState = Record<string, unknown>;
export interface WorkspaceLocalState {
    version: 1;
    paths: Record<string, string>;
}
export interface WorkspaceRegistryState {
    version: 1;
    workspaces: Record<string, string>;
}
export interface WorkspaceRegistryEntry {
    name: string;
    workspaceRoot: string;
}
export interface WorkspacePathOptions {
    globalDataDir?: string;
}
export declare function getWorkspaceMetadataDir(workspaceRoot: string): string;
export declare function getWorkspaceSharedStatePath(workspaceRoot: string): string;
export declare function getWorkspaceLocalStatePath(workspaceRoot: string): string;
export declare function getWorkspaceChangesDir(workspaceRoot: string): string;
export declare function getManagedWorkspacesDir(options?: WorkspacePathOptions): string;
export declare function getManagedWorkspaceRoot(workspaceName: string, options?: WorkspacePathOptions): string;
export declare function getWorkspaceRegistryPath(options?: WorkspacePathOptions): string;
export declare function getWorkspacePortableIgnorePatterns(): string[];
export declare function validateWorkspaceName(name: string): string;
export declare function validateWorkspaceLinkName(name: string): string;
export declare function isValidWorkspaceName(name: string): boolean;
export declare function isValidWorkspaceLinkName(name: string): boolean;
export declare function isWorkspaceRoot(candidateRoot: string): Promise<boolean>;
export declare function findWorkspaceRoot(startPath?: string): Promise<string | null>;
export declare function parseWorkspaceSharedState(content: string): WorkspaceSharedState;
export declare function parseWorkspaceLocalState(content: string): WorkspaceLocalState;
export declare function parseWorkspaceRegistryState(content: string): WorkspaceRegistryState;
export declare function serializeWorkspaceSharedState(state: WorkspaceSharedState): string;
export declare function serializeWorkspaceLocalState(state: WorkspaceLocalState): string;
export declare function serializeWorkspaceRegistryState(state: WorkspaceRegistryState): string;
export declare function listWorkspaceRegistryEntries(registry: WorkspaceRegistryState): WorkspaceRegistryEntry[];
export declare function readWorkspaceSharedState(workspaceRoot: string): Promise<WorkspaceSharedState>;
export declare function readWorkspaceLocalState(workspaceRoot: string): Promise<WorkspaceLocalState>;
export declare function readOptionalWorkspaceLocalState(workspaceRoot: string): Promise<WorkspaceLocalState | null>;
export declare function writeWorkspaceSharedState(workspaceRoot: string, state: WorkspaceSharedState): Promise<void>;
export declare function writeWorkspaceLocalState(workspaceRoot: string, state: WorkspaceLocalState): Promise<void>;
export declare function readWorkspaceRegistryState(options?: WorkspacePathOptions): Promise<WorkspaceRegistryState | null>;
export declare function writeWorkspaceRegistryState(state: WorkspaceRegistryState, options?: WorkspacePathOptions): Promise<void>;
export declare function workspaceChangesDirExists(workspaceRoot: string): Promise<boolean>;
//# sourceMappingURL=foundation.d.ts.map