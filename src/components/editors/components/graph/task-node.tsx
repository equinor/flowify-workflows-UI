import React, { memo, useState } from 'react';
import { Button, Chip, Icon, Tooltip, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { NodeProps } from 'react-flow-renderer/nocss';
import { DragIndicator as DragIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { INode } from '../../helpers/helpers';
import { Handles } from '.';
import { NodePreview } from '..';
import { isNotEmptyArray } from '../../../../common';

interface ITaskNode extends NodeProps<INode> {}

export const TaskNode = memo((props: ITaskNode) => {
  const { data, id } = props;
  const [open, setOpen] = useState<boolean>(false);

  const secrets = data?.component?.inputs?.filter((input) => input.type === 'env_secret');
  const volumes = data?.component?.inputs?.filter((input) => input.type === 'volume');

  const { inputMappings, setParameterConfig } = data;

  const secretsCount =
    secrets?.filter((secret) =>
      inputMappings?.some((mapping) => mapping.target.port === secret.name && mapping.target?.node === id),
    )?.length || 0;
  const volumesCount =
    volumes?.filter((volume) =>
      inputMappings?.some((mapping) => mapping.target.port === volume.name && mapping.target?.node === id),
    )?.length || 0;

  return (
    <Stack>
      <Stack spacing={2} direction="row" alignItems="center">
        <NodePreview node={props} open={open} onClose={setOpen} />
        <Handles parameters={data?.component?.inputs} type="Input" />
        <Stack alignItems="center" spacing={3} direction="row">
          <Stack spacing={1} alignItems="space-between">
            <Icon name="mall" size={16} color="#999" />
            <div>
              <Typography variant="body_short_bold">
                {data.component?.name}{' '}
                {data?.component?.version?.current ? `(v${data?.component?.version?.current})` : ''}
              </Typography>
              <Typography variant="body_short" style={{ maxWidth: '280px' }}>
                {data?.component?.description}
              </Typography>
            </div>
            <Stack direction="row" alignItems="center">
              <Chip>{data.component?.implementation?.type}</Chip>
              {data?.isInlineComponent && <Chip>local</Chip>}
              <Tooltip title="View component information" style={{ fontSize: '1rem' }}>
                <Button variant="ghost_icon" color="secondary" onClick={() => setOpen(true)}>
                  <Icon name="visibility" />
                </Button>
              </Tooltip>
              {!data?.isInlineComponent && (
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
              )}
            </Stack>
          </Stack>
          <DragIcon className="custom-drag-handle" sx={{ color: '#666', fontSize: '2rem' }} />
        </Stack>
        <Handles parameters={data?.component?.outputs} type="Output" />
      </Stack>
      <Stack direction="row">
        {isNotEmptyArray(secrets) && (
          <Button
            onClick={() => setParameterConfig({ type: 'secret', id })}
            variant="ghost"
            color={secretsCount < (secrets?.length || 0) ? 'danger' : 'primary'}
          >
            {secretsCount}/{secrets?.length} {secrets!.length > 1 ? 'Secrets' : 'Secret'}
          </Button>
        )}
        {isNotEmptyArray(volumes) && (
          <Button
            onClick={() => setParameterConfig({ type: 'volume', id })}
            variant="ghost"
            color={volumesCount < (volumes?.length || 0) ? 'danger' : 'primary'}
          >
            {volumesCount}/{volumes?.length} {volumes!.length > 1 ? 'Mounts' : 'Mount'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
});
