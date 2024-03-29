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
  type?: 'workspace' | 'share-workspace';
  name: string;
  roles: string[];
  description?: string;
}

/**
 * WorkspaceList is list of Workspace resources
 */
export interface WorkspaceList {
  items: Workspace[];
}

export enum WorkspaceOwnership {
  Owner = 'owner',
  Collaborator = 'collaborator',
};
