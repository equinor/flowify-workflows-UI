import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NodeProps } from 'react-flow-renderer/nocss';
import { Button, Chip, Icon, Tooltip, Typography } from '@equinor/eds-core-react';
import { Stack } from '@ui';
import { INode } from '../../../helpers/helpers';
import { Handles } from '..';
import { NodePreview } from '../..';

interface ISubNode extends NodeProps<INode> {}

export const SubNode = memo((props: ISubNode) => {
  const { data } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <NodePreview node={props} open={open} onClose={setOpen} />
      <Handles parameters={data?.component?.inputs} type="Input" filterParameters={false} />
      <Stack alignItems="center" spacing={1.5} direction="row">
        <Stack spacing={0.5} alignItems="space-between">
          <Icon name="mall" size={16} color="#999" />
          <div>
            <Typography variant="body_short_bold">{data.label}</Typography>
            <Typography variant="body_short" style={{ maxWidth: '280px' }}>
              {data?.component?.description}
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
                to={`/component/${data.component?.uid}/${data?.component?.version?.current}`}
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
        <Icon name="drag_indicator" className="custom-drag-handle" size={32} />
      </Stack>
      <Handles parameters={data?.component?.outputs} type="Output" filterParameters={false} />
    </Stack>
  );
});
