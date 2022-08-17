/**
 * Definition of a Role resource
 */
export interface Role {
  name: string;
  description: string;
}

/**
 * Workspace is the definition of a Workspace resource
 */
export interface Workspace {
  name: string;
  hasAccess: boolean;
  missingRoles: Role[][];
}

/**
 * WorkspaceList is list of Workspace resources
 */
export interface WorkspaceList {
  items: Workspace[];
}
