import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Container, Layout } from '../../layout';
interface SearchPageProps {
  //job: WorkflowJob | null;
}

export const SearchPage: React.FC<SearchPageProps> = (props: SearchPageProps): React.ReactElement => {
  const match = '';
  return (
    <Layout>
      <Container withMargins>
        <Card>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <Typography variant="h3" component="h2" style={{}}>
                Search - to be implemented
              </Typography>
            </div>
            <br />
            {Object.entries(match).map(([k, v]) => {
              return (
                <React.Fragment key={k}>
                  <Typography variant="h5" component="h3" style={{}}>
                    {k}
                  </Typography>
                  <Typography>{JSON.stringify(v)}</Typography>
                  <br />
                </React.Fragment>
              );
            })}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};
