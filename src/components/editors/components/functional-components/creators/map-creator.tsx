import React, { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { Button, Checkbox, Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Component, Graph } from '../../../../../models/v2';
import { generateMap } from '../helpers/generators';

interface MapCreatorProps {
  component?: Component;
  subcomponents?: Component[];
  setComponent: any;
  onClose: any;
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
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        nodes: generateMap((prev?.implementation as Graph)?.nodes, selectedComponent, subcomponents, options),
      },
    }));
    props.onClose();
  }

  return (
    <Stack sx={{ padding: '2rem' }} spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Select component to wrap in a map</Typography>
        <Stack direction="row" spacing={2}>
          {component?.implementation?.type === 'graph' &&
            (component.implementation as Graph).nodes?.map((node) => (
              <Radio
                key={node?.id}
                label={
                  typeof node.node === 'string'
                    ? subcomponents?.find((component) => component.uid === node.node)?.name
                    : node.node?.name || node.id
                }
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
      <Stack alignItems="flex-end">
        <Button disabled={!selectedComponent} onClick={onCreate}>
          <Icon name="add" />
          Create map component
        </Button>
      </Stack>
    </Stack>
  );
};
