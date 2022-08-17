import React, { memo, useState } from 'react';
import { Button, Chip, Icon, Tooltip, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { NodeProps } from 'react-flow-renderer/nocss';
import { DragIndicator as DragIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { INode } from '../../helpers/helpers';
import { Handles } from '.';
import { NodePreviewModal } from '../node-previews/node-preview-modal';

interface ISubNode extends NodeProps<INode> {}

export const SubNode = memo((props: ISubNode) => {
  const { data } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <NodePreviewModal node={props} open={open} onClose={setOpen} />
        <Handles parameters={data?.inputs} type="Input" filterParameters={false} />
        <Stack alignItems="center" spacing={3} direction="row">
          <Stack spacing={1} alignItems="space-between">
            <Icon name="mall" size={16} color="#999" />
            <div>
              <Typography variant="body_short_bold">{data.label}</Typography>
              <Typography variant="body_short" style={{ maxWidth: '280px' }}>
                {data.description}
              </Typography>
            </div>
            <Stack direction="row" alignItems="center">
              <Chip>{data.implementation?.type}</Chip>
              <Tooltip title="View component information" style={{ fontSize: '1rem' }}>
                <Button variant="ghost_icon" color="secondary" onClick={() => setOpen(true)}>
                  <Icon name="visibility" />
                </Button>
              </Tooltip>
              <Tooltip title="View component source" style={{ fontSize: '1rem' }}>
                <Link
                  to={`/component/${data.componentId}`}
                  target="_blank"
                  title="Open component in the editor (opens new tab)"
                >
                  <Button variant="ghost_icon" color="secondary" as="span">
                    <Icon name="code" />
                  </Button>
                </Link>
              </Tooltip>
            </Stack>
          </Stack>
          <DragIcon className="custom-drag-handle" sx={{ color: '#666', fontSize: '2rem' }} />
        </Stack>
        <Handles parameters={data?.outputs} type="Output" filterParameters={false} />
      </Stack>
    </Stack>
  );
});
