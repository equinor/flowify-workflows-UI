import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Layout } from '../../layout';
import { Breadcrumbs, Stack } from '../../components/ui';
import { Marketplace } from '../../components';

export const ComponentsPage: React.FC = () => {
  const { workspace } = useParams();

  return (
    <Layout>
      <Helmet>
        <title>Marketplace - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={2}>
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
