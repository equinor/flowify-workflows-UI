import React, { FC, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Stack } from '@ui';
import { Layout, Container } from '../../layout';
import { Marketplace, WorkspacesListing, DashboardListing, CreateComponent } from '../../components';

interface IDashboardPage {}

const DashboardPage: FC<IDashboardPage> = (props: IDashboardPage) => {
  const [newComponentOpen, setNewComponentOpen] = useState<boolean>(false);

  return (
    <Layout>
      <Helmet>
        <title>Dashboard - Flowify</title>
      </Helmet>
      <Container withMargins>
        <Stack spacing={4}>
          <Breadcrumbs links={[{ title: 'Dashboard' }]} />
          <WorkspacesListing />
          <CreateComponent open={newComponentOpen} setOpen={setNewComponentOpen} />
          <DashboardListing
            title="Components"
            icon={<Icon name="component" />}
            sections={[
              {
                linklist: [
                  { title: 'Visit Flowify marketplace', icon: 'mall', url: '/components' },
                  {
                    title: 'Create new component',
                    icon: 'add',
                    button: true,
                    onClick: () => setNewComponentOpen(true),
                  },
                ],
              },
              {
                title: 'Component documentation',
                linklist: [
                  {
                    title: 'Creating a component',
                    url: 'https://equinor.github.io/flowify-documentation/components/',
                    target: '_blank',
                    external: true,
                  },
                  {
                    title: 'Building a brick component',
                    url: 'https://equinor.github.io/flowify-documentation/bricks/',
                    target: '_blank',
                    external: true,
                  },
                  {
                    title: 'Building a graph component',
                    url: 'https://equinor.github.io/flowify-documentation/graphs/',
                    target: '_blank',
                    external: true,
                  },
                ],
              },
            ]}
          >
            <Stack style={{ marginTop: '4rem' }} spacing={1}>
              <Typography variant="h4">New marketplace components</Typography>
              <Marketplace preview />
            </Stack>
          </DashboardListing>
        </Stack>
      </Container>
    </Layout>
  );
};

export default DashboardPage;
