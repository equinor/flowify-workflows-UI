import React, { FC } from 'react';
import { useParams } from 'react-router';
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
          <Breadcrumbs
            links={[
              { title: 'Dashboard', href: '/dashboard' },
              { title: workspace || '', href: `/workspace/${workspace}` },
              { title: 'Workflows' },
            ]}
          />
          <WorkflowsListing workspace={workspace!} showTitle={false} />
        </Stack>
      </Container>
    </Layout>
  );
};
