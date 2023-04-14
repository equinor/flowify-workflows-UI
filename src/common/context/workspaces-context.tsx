import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Workspace, WorkspaceList } from '@models/v2';
import { services } from '@services';
import { useUser } from '@common';

interface WorkspacesContextInterface {
  workspaces: Workspace[];
  hasAnyAdminAccess: boolean;
  resetWorkspacesTimestamp: Function;
  getWorkspaceItem: Function;
}

const WorkspacesContext = React.createContext<WorkspacesContextInterface>({ workspaces: [], hasAnyAdminAccess: false, resetWorkspacesTimestamp: () => {}, getWorkspaceItem: () => {} });

export function WorkspacesProvider({ children }: { children: React.ReactNode }) {
  const [timestamp, setTimestamp] = useState<string|null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const [hasAnyAdminAccess, setHasAnyAdminAccess] = useState(false);

  const { checkIfUserIsWorkspaceEditor } = useUser();

  useEffect(() => {
    if (timestamp !== null) return;
  
    services.workspace.list().then((res: WorkspaceList) => {
        setWorkspaces(res?.items || []);
        const hasAccess = res.items?.some((workspace) => checkIfUserIsWorkspaceEditor(workspace));
        setHasAnyAdminAccess(hasAccess);
        setTimestamp(moment.utc().toISOString());
    });
  }, [timestamp, checkIfUserIsWorkspaceEditor]);
  
  const resetWorkspacesTimestamp = () => setTimestamp(null);

  const getWorkspaceItem = (name: string) => workspaces?.find((space) => space.name === name);
  //@ts-ignore
  return <WorkspacesContext.Provider value={{ workspaces, hasAnyAdminAccess, resetWorkspacesTimestamp, getWorkspaceItem }}>{children}</WorkspacesContext.Provider>;
}

export function useWorkspaces() {
  return React.useContext(WorkspacesContext);
}