import React, { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { Breadcrumbs, ComponentIcon } from '../../components/ui';
import { Layout, Container } from '../../layout';
import { Marketplace, WorkspacesListing } from '../../components';
import { DashboardListing } from '../../components/listings/dashboard-listing';
import { Typography } from '@equinor/eds-core-react';
import { CreateComponent } from '../../components/creators';
import { Helmet } from 'react-helmet-async';

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
          <Breadcrumbs>
            <span>
              <b>Dashboard</b>
            </span>
          </Breadcrumbs>
          <WorkspacesListing />
          <CreateComponent open={newComponentOpen} setOpen={setNewComponentOpen} />
          <DashboardListing
            title="Components"
            icon={<ComponentIcon size={24} />}
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
                    url: 'https://equinor.github.io/flowify-documentation/docs/component/',
                    target: '_blank',
                    external: true,
                  },
                  {
                    title: 'Building a brick component',
                    url: 'https://equinor.github.io/flowify-documentation/docs/component/build/brick/',
                    target: '_blank',
                    external: true,
                  },
                  {
                    title: 'Building a graph component',
                    url: 'https://equinor.github.io/flowify-documentation/docs/component/build/graph/',
                    target: '_blank',
                    external: true,
                  },
                ],
              },
            ]}
          >
            <Stack sx={{ marginTop: '4rem' }} spacing={1}>
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
