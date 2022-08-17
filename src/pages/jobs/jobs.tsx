import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui';
import { JobsListing } from '../../components';
import { Layout, Container } from '../../layout';
import { Stack } from '@mui/material';

interface JobsPageProps {}

export const JobsPage: React.FC<JobsPageProps> = (props: JobsPageProps) => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Container withMargins>
        <Stack spacing={8}>
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
