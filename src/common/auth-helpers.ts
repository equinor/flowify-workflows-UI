import { Workspace } from '@models/v2';

export const checkWorkspaceHasRole = (workspace: Workspace, role: string) => !!workspace?.roles?.includes(role);
export const checkWorkspaceHasSomeRole = (workspace: Workspace, roles: string[]) => !!roles.find((r) => checkWorkspaceHasRole(workspace, r));
