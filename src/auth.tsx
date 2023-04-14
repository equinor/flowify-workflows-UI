import React from 'react';
import { useParams } from 'react-router';
import { useUser, useWorkspaces } from '@common';
import { Container, Layout } from './layout';

export function WorkspaceAuth(props: { children: React.ReactNode }) {
  const { children } = props;
  const params = useParams();
  const workspaceName = params?.workspace;
  const { workspaces } = useWorkspaces();
  const workspace = workspaces?.find((space) => space.name === workspaceName);
  const { checkIfUserIsWorkspaceViewer } = useUser();
  
  if (!workspaces) {
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

  // Does user have access to view workspace
  if (!checkIfUserIsWorkspaceViewer(workspace)) {
    return (
      <Layout>
        <Container withMargins>You do not have access to the {workspaceName} workspace.</Container>
      </Layout>
    );
  }
  return <>{children}</>;
}
