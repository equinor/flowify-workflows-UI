import React from 'react';
import { Typography } from '@equinor/eds-core-react';
import { NodeStatus } from '../../../../../../models';
import { Container } from '../../../../../../models/kubernetes';
import { Stack } from '../../../../../ui';

interface NodeContainersProps {
  nodeStatus: NodeStatus;
  container: Container;
}
export const NodeContainers: React.FC<NodeContainersProps> = (props: NodeContainersProps) => {
  const { container } = props;

  return (
    <Stack spacing={1}>
      <Typography variant="h3">Containers</Typography>
      {container ? (
        <>
          <div>
            <Typography variant="body_short_bold">Name:</Typography>
            <Typography variant="body_short">{container.name || 'main'}</Typography>
          </div>
          <div>
            <Typography variant="body_short_bold">Image:</Typography>
            <Typography variant="body_short">{container.image || ''}</Typography>
          </div>
          <div>
            <Typography variant="body_short_bold">Command:</Typography>
            <Typography variant="body_short">{container.command || ''}</Typography>
          </div>
          <div>
            <Typography variant="body_short_bold">Args:</Typography>
            <Typography variant="body_short">
              {container.args?.map((arg) => (
                <>
                  {arg} <br />
                </>
              )) || ''}
            </Typography>
          </div>
        </>
      ) : (
        <Typography variant="body_short">No container info found</Typography>
      )}
    </Stack>
  );
};
