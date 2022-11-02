import React, { memo, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { NodeProps } from 'react-flow-renderer/nocss';
import { INode, getComponentFromRef } from '../../../helpers/helpers';
import { Handles } from '..';
import { NodePreview } from '../..';
import { Map } from '../../../../../models/v2';
import { isNotEmptyArray } from '../../../../../common';
import { Button, Chip, Stack } from '../../../../ui';

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
      <Stack spacing={1}>
        <Stack className="react-flow__node-mapNode--internal" spacing={1.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <NodePreview node={props} open={open} onClose={setOpen} />
            <Stack alignItems="center" spacing={1.5} direction="row">
              <Stack spacing={0.5} alignItems="space-between">
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
                <Stack direction="row" spacing={1}>
                  {isNotEmptyArray(secrets) && (
                    <Button
                      style={{ padding: '0.5rem' }}
                      onClick={() => setParameterConfig({ type: 'secret', id, map: false })}
                      theme={secretsCount < (secrets?.length || 0) ? 'danger' : 'create'}
                    >
                      {secretsCount}/{secrets?.length} {secrets!.length > 1 ? 'Secrets' : 'Secret'}
                    </Button>
                  )}
                  {isNotEmptyArray(volumes) && (
                    <Button
                      style={{ padding: '0.5rem' }}
                      onClick={() => setParameterConfig({ type: 'volume', id, map: false })}
                      theme={volumesCount < (volumes?.length || 0) ? 'danger' : 'create'}
                    >
                      {volumesCount}/{volumes?.length} {volumes!.length > 1 ? 'Mounts' : 'Mount'}
                    </Button>
                  )}
                </Stack>
                <Button leftIcon="settings" onClick={() => data.setConfigComponent({ id: props.id, type: 'map' })}>
                  Configure map
                </Button>
              </Stack>
              <Icon name="drag_indicator" className="custom-drag-handle" size={32} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Handles parameters={data?.component?.outputs} type="Output" />
    </>
  );
});
