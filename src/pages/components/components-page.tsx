import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Stack } from '@ui';
import { Container, Layout } from '../../layout';
import { Marketplace } from '../../components';

export const ComponentsPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Marketplace - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={2}>
          <Breadcrumbs links={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Marketplace' }]} />
          <Marketplace />
        </Stack>
      </Container>
    </Layout>
  );
};
