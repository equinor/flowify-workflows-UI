import React, { memo, useState } from 'react';
import { Button, Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { NodeProps } from 'react-flow-renderer/nocss';
import { DragIndicator as DragIcon } from '@mui/icons-material';
import { INode, getComponentFromRef } from '../../helpers/helpers';
import { Handles } from '.';
import { NodePreview } from '..';
import { Map } from '../../../../models/v2';
import { isNotEmptyArray } from '../../../../common';

interface IMapNode extends NodeProps<INode> {}

export const MapNode = memo((props: IMapNode) => {
  const { data, id } = props;
  const [open, setOpen] = useState<boolean>(false);

  const childRef = (data?.component?.implementation as Map).node;
  const childNode = getComponentFromRef(childRef, data.subcomponents || []);

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
    <>
      <Handles parameters={data?.component?.inputs} type="Input" />
      <div>
        <Button variant="ghost" onClick={() => data.setConfigComponent({ id: props.id, type: 'map' })}>
          Configure map
        </Button>
        <Stack className="react-flow__node-mapNode--internal" spacing={3}>
          <Stack spacing={2} direction="row" alignItems="center">
            <NodePreview node={props} open={open} onClose={setOpen} />
            <Stack alignItems="center" spacing={3} direction="row">
              <Stack spacing={1} alignItems="space-between">
                <Icon name="formula" size={16} color="#999" />
                <div>
                  <Typography variant="body_short_bold">Map({childNode?.name})</Typography>
                  <Typography variant="body_short" style={{ maxWidth: '280px' }}>
                    {data?.component?.description}
                  </Typography>
                </div>
                <Stack direction="row" alignItems="center">
                  <Chip>{data?.component?.implementation?.type}</Chip>
                </Stack>
              </Stack>
              <DragIcon className="custom-drag-handle" sx={{ color: '#666', fontSize: '2rem' }} />
            </Stack>
          </Stack>
          <Stack direction="row">
            {isNotEmptyArray(secrets) && (
              <Button
                onClick={() => setParameterConfig({ type: 'secret', id, map: false })}
                variant="ghost"
                color={secretsCount < (secrets?.length || 0) ? 'danger' : 'primary'}
              >
                {secretsCount}/{secrets?.length} {secrets!.length > 1 ? 'Secrets' : 'Secret'}
              </Button>
            )}
            {isNotEmptyArray(volumes) && (
              <Button
                onClick={() => setParameterConfig({ type: 'volume', id, map: false })}
                variant="ghost"
                color={volumesCount < (volumes?.length || 0) ? 'danger' : 'primary'}
              >
                {volumesCount}/{volumes?.length} {volumes!.length > 1 ? 'Mounts' : 'Mount'}
              </Button>
            )}
          </Stack>
        </Stack>
      </div>
      <Handles parameters={data?.component?.outputs} type="Output" />
    </>
  );
});
