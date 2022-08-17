import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Container, Layout } from '../../layout';
import { Breadcrumbs } from '../../components/ui';
import { Marketplace } from '../../components';

export const ComponentsPage: React.FC = () => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Container withMargins>
        <Stack spacing={4}>
          <Breadcrumbs>
            <Link to="/dashboard">Dashboard</Link>
            {workspace && <Link to={`/workspace/${workspace}`}>{workspace}</Link>}
            <span>
              <b>Marketplace</b>
            </span>
          </Breadcrumbs>
          <Marketplace />
        </Stack>
      </Container>
    </Layout>
  );
};
