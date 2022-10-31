import React, { FC } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Stack } from '../../components/ui';
import WorkflowsListing from '../../components/workflows-listing/workflows-listing';
import { Container, Layout } from '../../layout';

export const WorkflowsPage: FC = () => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Helmet>
        <title>Workflows - {workspace} - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={4}>
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
