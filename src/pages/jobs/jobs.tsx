import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Stack } from '../../components/ui';
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
          <Breadcrumbs>
            <Link to="/dashboard">Dashboard</Link>
            <Link to={`/workspace/${workspace}`}>{workspace}</Link>
            <span>
              <b>Jobs</b>
            </span>
          </Breadcrumbs>
          <JobsListing workspace={workspace!} />
        </Stack>
      </Container>
    </Layout>
  );
};
