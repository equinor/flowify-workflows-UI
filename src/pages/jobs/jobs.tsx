import React from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Stack } from '@ui';
import { JobsListing } from '../../components';
import { Layout, Container } from '../../layout';

interface JobsPageProps {}

export const JobsPage: React.FC<JobsPageProps> = (props: JobsPageProps) => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Helmet>
        <title>Jobs - {workspace} - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={4}>
          <Breadcrumbs
            links={[
              { title: 'Dashboard', href: '/dashboard' },
              { title: workspace || '', href: `/workspace/${workspace}` },
              { title: 'Jobs' },
            ]}
          />
          <JobsListing workspace={workspace!} />
        </Stack>
      </Container>
    </Layout>
  );
};
