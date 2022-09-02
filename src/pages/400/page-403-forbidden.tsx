import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Container, Layout } from '../../layout';
import { Helmet } from 'react-helmet-async';

interface IPage403Forbidden {
  children: React.ReactNode;
}

export const Page403Forbidden: FC<IPage403Forbidden> = (props: IPage403Forbidden) => {
  const { children } = props;

  return (
    <Layout>
      <Helmet>
        <title>403 - Flowify</title>
      </Helmet>
      <Container withMargins>
        <i className="far fa-frown fa-5x" />
        <br />
        <br />
        <Typography as="h2" variant="h4">
          403 - You don't have access
        </Typography>
        <br />
        <br />
        <Typography>
          Access to the workspace requires access to the underlying data sources
          <br />
          <br />
          please apply @ <a href="https://accessit.equinor.com">https://accessit.equinor.com</a>
        </Typography>
        {children && children}
      </Container>
    </Layout>
  );
};
