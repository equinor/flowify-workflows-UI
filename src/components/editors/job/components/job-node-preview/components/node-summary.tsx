import { Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import React from 'react';
import { NodeStatus } from '../../../../../../models';

interface NodeSummaryProps {
  nodeStatus: NodeStatus;
}
export const NodeSummary: React.FC<NodeSummaryProps> = ({ nodeStatus }: NodeSummaryProps) => {
  return (
    <Stack spacing={1}>
      <Typography variant="h4">Summary</Typography>
      <Typography variant="body_short">
        <b>Id: </b>
        {nodeStatus.id || ''}
      </Typography>
      <Typography variant="body_short">
        <b>Name: </b>
        {nodeStatus.displayName || ''}
      </Typography>
      <Typography variant="body_short">
        <b>Templatename: </b>
        {nodeStatus.templateName || ''}
      </Typography>
      <Typography variant="body_short">
        <b>Phase: </b>
        {nodeStatus.phase || ''}
      </Typography>
    </Stack>
  );
};
