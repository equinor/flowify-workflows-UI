import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@equinor/eds-core-react';
import { Container, Layout } from '../../layout';
import { Helmet } from 'react-helmet-async';

export const Page404NotFound: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>404 - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Typography variant="h2">404 Page not found</Typography>
        <Typography variant="body_long_link">
          <Link to="/dashboard">Go back to dashboard</Link>
        </Typography>
      </Container>
    </Layout>
  );
};
