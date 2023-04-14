import React, { FC, useState } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Container, Layout } from '../../layout';
import { Stack, MultiToggle, ToggleButton, Breadcrumbs } from '@ui';
import { WorkflowsListing, JobsListing } from '../../components';
import { CreateWorkflow, ShareWorkspace, DeleteWorkspace } from '../../components/creators';
import { Icon } from '@equinor/eds-core-react';

interface IWorkspace {}

const Workspace: FC<IWorkspace> = (props: IWorkspace) => {
  const { workspace } = useParams();
  const [type, setType] = useState<'workflows' | 'jobs'>('workflows');

  return (
    <Layout>
      <Helmet>
        <title>{workspace} - Flowify</title>
      </Helmet>
      <Container>
        <Stack style={{ padding: '1rem 3rem 1rem 3rem' }} spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Breadcrumbs links={[{ title: 'Dashboard', href: '/dashboard' }, { title: workspace || '' }]} />
            <Stack direction="row" spacing={1}>
              <ShareWorkspace workspace={workspace!} />
              <DeleteWorkspace workspace={workspace!} />
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <MultiToggle style={{ fontSize: '1.5rem' }}>
              <ToggleButton active={type === 'workflows'} onClick={() => setType('workflows')}>
                <Icon name="workflow" />
                Workflows
              </ToggleButton>
              <ToggleButton active={type === 'jobs'} onClick={() => setType('jobs')}>
                <Icon name="launch" />
                Jobs
              </ToggleButton>
            </MultiToggle>
            <CreateWorkflow workspace={workspace!} />
          </Stack>
        </Stack>
        <Stack direction="row" style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', padding: '1rem 3rem' }}>
          {type === 'workflows' ? <WorkflowsListing workspace={workspace!} /> : <JobsListing workspace={workspace!} />}
        </Stack>
      </Container>
    </Layout>
  );
};

export default Workspace;
