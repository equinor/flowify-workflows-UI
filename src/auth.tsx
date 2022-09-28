import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Container, Layout } from './layout';
import { Workspace, WorkspaceList } from './models/v2';
import { services } from './services';

interface AuthContextInterface {
  items?: Workspace[];
}

const AuthContext = React.createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceList>();
  useEffect(() => {
    let isMounted = true;
    services.workspace.list().then((res: WorkspaceList) => {
      if (isMounted) {
        setWorkspaces(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  //@ts-ignore
  return <AuthContext.Provider value={workspaces}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export function WorkspaceAuth(props: { children: React.ReactNode }) {
  const params = useParams();
  const { children } = props;
  const workspaceName = params?.workspace;
  const auth = useAuth();
  const workspace = auth?.items?.find((space) => space.name === workspaceName);
  if (!auth?.items) {
    return null;
  }
  // Does workspace exist
  if (!workspace) {
    return (
      <Layout>
        <Container withMargins>{workspaceName} is not a valid workspace.</Container>
      </Layout>
    );
  }
  // Does user have access to workspace
  if (!workspace.hasAccess) {
    return (
      <Layout>
        <Container withMargins>You do not have access to the {workspaceName} workspace.</Container>
      </Layout>
    );
  }
  return <>{children}</>;
}
