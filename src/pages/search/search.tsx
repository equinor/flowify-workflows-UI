import React from 'react';
import { Container, Layout } from '../../layout';
interface SearchPageProps {}

export const SearchPage: React.FC<SearchPageProps> = (props: SearchPageProps): React.ReactElement => {
  return (
    <Layout>
      <Container withMargins></Container>
    </Layout>
  );
};
