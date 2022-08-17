import React from 'react';
import { WorkflowEditor } from '../../components';
import { useParams } from 'react-router';
import { Container, Layout } from '../../layout';

interface WorkflowPageProps {}

export const WorkflowPage: React.FC<WorkflowPageProps> = (props: WorkflowPageProps): React.ReactElement => {
  const { workspace, workflow } = useParams();
  return (
    <Layout dashboard>
      <Container>
        <WorkflowEditor uid={workflow!} workspace={workspace!} />
      </Container>
    </Layout>
  );
};
