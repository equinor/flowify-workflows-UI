import React, { FC } from 'react';
import { Stack, Dialog } from '@mui/material';
import { Typography } from '@equinor/eds-core-react';
import { Component, Data, Edge, Graph, IVolume } from '../../../../models/v2';
import { Select } from '../../../ui';

interface SecretsVolumesConfigProps {
  parameterConfig: { type: 'secret' | 'volume'; id: string } | undefined;
  setParameterConfig: any;
  component: Component | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  subcomponents: Component[] | undefined;
  type: 'workflow' | 'component';
  workspace?: string;
  workspaceSecrets?: string[];
  workspaceVolumes?: IVolume[];
}

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
  const subcomponent = typeof subnode === 'string' ? subcomponents?.find((comp) => comp.uid === subnode) : subnode;

  const secrets = subcomponent?.inputs?.filter((input: any) => input.type === 'env_secret');
  const mounts = subcomponent?.inputs?.filter((input: any) => input.type === 'volume');

  const secretOptions =
    type === 'workflow'
      ? workspaceSecrets?.map((secret) => ({ value: secret, label: secret }))
      : component?.inputs
          ?.filter((input) => input.type === 'env_secret')
          .map((input) => ({ value: input.name, label: input.name }));

  const mountOptions =
    type === 'workflow'
      ? workspaceVolumes?.map((volume) => ({ value: volume?.uid, label: volume?.volume?.name }))
      : component?.inputs
          ?.filter((input) => input.type === 'volume')
          .map((input) => ({ value: input.name, label: input.name }));

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

  function onSelectChange(event: any, name: string) {
    const { value } = event.target;
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

  function findSelectValue(name: string) {
    const inputName = inputMappings?.find((mapping) => mapping?.target?.node === id && mapping?.target?.port === name)
      ?.source?.port;
    if (type === 'component') {
      return inputName || '';
    }
    const input = component?.inputs?.find((input) => input.name === inputName);
    return input?.userdata?.value || '';
  }

  return (
    <Dialog open={parameterConfig !== undefined} onClose={() => setParameterConfig()} fullWidth maxWidth="md">
      <Stack padding="2rem" spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h5">
            {subcomponent?.name} {parameterConfig?.type}s
          </Typography>
          {type === 'component' && (
            <Typography variant="body_short">
              When creating components, mounts and secrets need to be defined as inputs before they can be used in
              sub-components.
            </Typography>
          )}
        </Stack>
        <Stack spacing={2}>
          {parameterConfig.type === 'secret' &&
            secrets?.map((secret: Data) => (
              <Select
                key={secret.name}
                id={secret.name || ''}
                label={secret.name}
                options={secretOptions}
                onChange={(event: any) => onSelectChange(event, secret.name || '')}
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
                id={volume.name || ''}
                label={volume.name}
                options={mountOptions}
                onChange={(event: any) => onSelectChange(event, volume.name || '')}
                placeholder={
                  type === 'workflow' ? 'Select from workspace configured volumes' : 'Select from component inputs'
                }
                value={findSelectValue(volume.name || '')}
              />
            ))}
        </Stack>
      </Stack>
    </Dialog>
  );
};
