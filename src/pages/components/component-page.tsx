import React, { FC } from 'react';
import { useParams } from 'react-router';
import { ComponentEditor } from '../../components';
import { Container, Layout } from '../../layout';

interface IComponentPage {}

export const ComponentPage: FC<IComponentPage> = () => {
  const { workspace, component } = useParams();

  return (
    <Layout dashboard>
      <Container dashboard>
        <ComponentEditor name={component!} workspace={workspace!} />
      </Container>
    </Layout>
  );
};
