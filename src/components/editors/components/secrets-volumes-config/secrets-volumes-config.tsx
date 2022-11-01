import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Data, Edge, Graph } from '../../../../models/v2';
import { DialogWrapper, Message, Stack, Modal } from '../../../ui';
import { getComponentFromRef } from '../../helpers';
import { SecretsVolumesConfigProps } from './types';
import { Select } from '../../../form';

export const SecretsVolumesConfig: FC<SecretsVolumesConfigProps> = (props: SecretsVolumesConfigProps) => {
  const {
    parameterConfig,
    setParameterConfig,
    component,
    subcomponents,
    type,
    setComponent,
    workspaceSecrets,
    workspaceVolumes,
  } = props;

  if (!parameterConfig) {
    return null;
  }
  const { id } = parameterConfig;

  const node = (component?.implementation as Graph)?.nodes?.find((node) => node.id === id);
  const subnode = node?.node;
  const subcomponent = getComponentFromRef(subnode!, subcomponents || []);

  const secrets = subcomponent?.inputs?.filter((input: any) => input.type === 'env_secret');
  const mounts = subcomponent?.inputs?.filter((input: any) => input.type === 'volume');

  const secretOptions =
    type === 'workflow'
      ? workspaceSecrets?.map((secret) => ({ value: secret || '', label: secret || '' }))
      : component?.inputs
          ?.filter((input) => input.type === 'env_secret')
          .map((input) => ({ value: input.name || '', label: input.name || '' }));

  const mountOptions =
    type === 'workflow'
      ? workspaceVolumes?.map((volume) => ({
          value: volume?.uid || '',
          label: `${volume?.volume?.name} (${volume?.volume?.csi?.volumeAttributes?.containerName})`,
        }))
      : component?.inputs
          ?.filter((input) => input.type === 'volume')
          .map((input) => ({ value: input.name || '', label: input.name || '' }));

  const { inputMappings } = component?.implementation as Graph;

  function updateInput(inputs: Data[], existing: number, id: string, value: string) {
    if (existing === -1 || existing === undefined) {
      inputs.push({
        name: id,
        type: parameterConfig?.type === 'secret' ? 'env_secret' : 'volume',
        mediatype: ['env_secret'],
        userdata: { value },
      });
      return inputs;
    }
    inputs[existing] = { ...inputs[existing], userdata: { ...inputs[existing]?.userdata, value } };
    return inputs;
  }

  function updateWorkflowMappings(mappings: Edge[], existingMapping: number, name: string, inputId: string) {
    if (existingMapping === -1 || existingMapping === undefined) {
      mappings.push({ target: { node: id, port: name }, source: { port: inputId } });
      return mappings;
    }
    return mappings;
  }

  function updateComponentMappings(mappings: Edge[] | undefined, existingMapping: number, name: string, value: string) {
    if (!mappings) {
      return [];
    }
    if (existingMapping !== -1 && existingMapping !== undefined) {
      mappings.splice(existingMapping, 1);
    }
    mappings.push({ target: { node: id, port: name }, source: { port: value } });
    return mappings;
  }

  function onSelectChange(value: any, name: string) {
    const existingMapping = inputMappings?.findIndex(
      (mapping) => mapping?.target?.node === id && mapping?.target?.port === name,
    );
    if (type === 'workflow') {
      const inputId = `${id}-${name}`;
      const existingInputIndex = component?.inputs?.findIndex((input) => input.name === inputId);
      setComponent((prev) => ({
        ...prev,
        inputs: updateInput(prev?.inputs || [], existingInputIndex!, inputId, value),
        implementation: {
          ...prev?.implementation,
          inputMappings: updateWorkflowMappings(
            (prev?.implementation as Graph)?.inputMappings || [],
            existingMapping!,
            name,
            inputId,
          ),
        },
      }));
      return;
    }
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        inputMappings: updateComponentMappings(
          (prev?.implementation as Graph)?.inputMappings,
          existingMapping!,
          name,
          value,
        ),
      },
    }));
  }

  function findSelectValue(name: string): string {
    const inputName = inputMappings?.find((mapping) => mapping?.target?.node === id && mapping?.target?.port === name)
      ?.source?.port;
    if (type === 'component') {
      return inputName || '';
    }
    const input = component?.inputs?.find((input) => input.name === inputName);
    return (input?.userdata?.value as string) || '';
  }

  return (
    <Modal open={parameterConfig !== undefined} onClose={() => setParameterConfig()} fullWidth maxWidth="md">
      <DialogWrapper padding={2} spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h5">
            {subcomponent?.name} {parameterConfig?.type}s
          </Typography>
          {type === 'component' && (
            <Message icon="info_circle">
              <Typography variant="body_short">
                When creating components, mounts and secrets need to be defined as inputs before they can be used in
                sub-components.
              </Typography>
            </Message>
          )}
        </Stack>
        <Stack spacing={1} style={{ paddingBottom: '11rem' }}>
          {parameterConfig.type === 'secret' &&
            secrets?.map((secret: Data) => (
              <Select
                key={secret.name}
                name={secret.name || ''}
                label={secret.name}
                options={secretOptions || []}
                onChange={(item: any) => onSelectChange(item, secret.name || '')}
                placeholder={
                  type === 'workflow' ? 'Select from workspace configured secrets' : 'Select from component inputs'
                }
                value={findSelectValue(secret.name || '')}
              />
            ))}
          {parameterConfig.type === 'volume' &&
            mounts?.map((volume: Data) => (
              <Select
                key={volume.name}
                name={volume.name || ''}
                label={volume.name}
                options={mountOptions || []}
                onChange={(item: any) => onSelectChange(item, volume.name || '')}
                placeholder={
                  type === 'workflow' ? 'Select from workspace configured volumes' : 'Select from component inputs'
                }
                value={findSelectValue(volume.name || '')}
              />
            ))}
        </Stack>
      </DialogWrapper>
    </Modal>
  );
};
