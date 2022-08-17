import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@equinor/eds-core-react';
import { Container, Layout } from '../../layout';

export const Page404NotFound: React.FC = () => {
  return (
    <Layout>
      <Container withMargins>
        <Typography variant="h2">404 Page not found</Typography>
        <Typography variant="body_long_link">
          <Link to="/dashboard">Go back to dashboard</Link>
        </Typography>
      </Container>
    </Layout>
  );
};
