import React, { FC } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Stack } from '@mui/material';
import { Container, Layout } from '../../layout';
import { WorkflowsListing, JobsListing } from '../../components';
import { WorkspaceHeader } from '../../components/ui';

interface IWorkspace {}

const Workspace: FC<IWorkspace> = (props: IWorkspace) => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Helmet>
        <title>{workspace} - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={6}>
          <WorkspaceHeader workspace={workspace!} />
          <WorkflowsListing workspace={workspace!} />
          <JobsListing workspace={workspace!} />
        </Stack>
      </Container>
    </Layout>
  );
};

export default Workspace;
