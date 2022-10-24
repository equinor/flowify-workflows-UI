import { Typography } from '@equinor/eds-core-react';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Workflow } from '../../../models/v2';
import { RunWorkflow } from '../../creators';
import { Timestamp } from '../../timestamp';
import { Chip, Paper, Stack } from '../../ui';

interface WorkflowCardProps {
  workflow: Workflow;
  workspace: string;
}

export const WorkflowCard: FC<WorkflowCardProps> = (props: WorkflowCardProps) => {
  const { workflow, workspace } = props;
  return (
    <Stack direction="row" justifyContent="stretch" spacing={0.5}>
      <Link
        style={{ flexGrow: '2' }}
        to={`/workspace/${workspace}/workflow/${workflow?.uid}/${workflow?.version?.current}`}
      >
        <Paper
          direction="row"
          theme="light"
          spacing={2}
          padding={2}
          alignItems="center"
          justifyContent="space-between"
          key={`${workflow?.uid}_${workflow?.version?.current}`}
          hoverable
        >
          <div>
            <Typography variant="h5">
              {workflow?.name} <Chip>v{workflow?.version?.current}</Chip>
            </Typography>
            <Typography variant="body_short">{workflow?.description}</Typography>
          </div>
          <div>
            <Typography variant="body_short">
              Updated <Timestamp date={workflow?.timestamp!} /> by {workflow?.modifiedBy?.email}
            </Typography>
          </div>
        </Paper>
      </Link>
      <Paper justifyContent="center" theme="light" style={{ display: 'inline-grid' }}>
        <RunWorkflow
          workflow={workflow?.uid!}
          buttonProps={{ theme: 'simple', leftIcon: 'launch', children: 'Run', style: { height: '100%' } }}
        />
      </Paper>
    </Stack>
  );
};
