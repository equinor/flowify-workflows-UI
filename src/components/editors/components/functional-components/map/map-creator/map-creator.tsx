import React, { FC, useState } from 'react';
import { Checkbox, Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Component, Graph } from '@models/v2';
import { Button, Stack } from '@ui';
import { getComponentFromRef } from '@common';
import { generateMap } from './helpers';

interface MapCreatorProps {
  component?: Component;
  subcomponents?: Component[];
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  onClose: () => void;
}

export const MapCreator: FC<MapCreatorProps> = (props: MapCreatorProps) => {
  const { component, subcomponents, setComponent } = props;
  const [options, setOptions] = useState({ inputs: true, outputs: true, connections: true });
  const [selectedComponent, setSelectedComponent] = useState('');

  function onOptionsChange(event: any) {
    const { value, checked } = event.target;
    setOptions((prev) => ({
      ...prev,
      [value]: checked,
    }));
  }

  function onCreate() {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        nodes: generateMap((prev?.implementation as Graph)?.nodes || [], selectedComponent, subcomponents, options),
      },
    }));
    props.onClose();
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Select component to wrap in a map</Typography>
        <Stack direction="row" spacing={1}>
          {component?.implementation?.type === 'graph' &&
            (component.implementation as Graph).nodes?.map((node) => (
              <Radio
                key={node?.id}
                label={getComponentFromRef(node.node, subcomponents || [])?.name}
                value={node?.id}
                checked={selectedComponent === node?.id}
                onChange={(event: any) => setSelectedComponent(event.target.value)}
              />
            ))}
        </Stack>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="h6">Automatically generate:</Typography>
        <Stack direction="row" spacing={2}>
          <Checkbox label="Inputs" value="inputs" checked={options?.inputs} onChange={onOptionsChange} />
          <Checkbox label="Outputs" value="outputs" checked={options?.outputs} onChange={onOptionsChange} />
          <Checkbox label="Connections" value="connections" checked={options?.connections} onChange={onOptionsChange} />
        </Stack>
      </Stack>
      <Stack>
        <Button theme="create" disabled={!selectedComponent} onClick={onCreate}>
          <Icon name="add" />
          Create map component
        </Button>
      </Stack>
    </Stack>
  );
};
