import React, { FC } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Breadcrumbs } from '../../components/ui';
import WorkflowsListing from '../../components/workflows-listing/workflows-listing';
import { Container, Layout } from '../../layout';
import { Helmet } from 'react-helmet-async';

export const WorkflowsPage: FC = () => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Helmet>
        <title>Workflows - {workspace} - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={6}>
          <Breadcrumbs>
            <Link to="/dashboard">Dashboard</Link>
            <Link to={`/workspace/${workspace}`}>{workspace}</Link>
            <span>
              <b>Workflows</b>
            </span>
          </Breadcrumbs>
          <WorkflowsListing workspace={workspace!} showTitle={false} />
        </Stack>
      </Container>
    </Layout>
  );
};
