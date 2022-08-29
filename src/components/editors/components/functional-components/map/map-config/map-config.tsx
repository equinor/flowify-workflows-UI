import React, { FC, useEffect, useState } from 'react';
import { Stack, Dialog, Grid } from '@mui/material';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { nanoid } from '../../../../helpers';
import { Parameter } from '../../../parameter';
import { Component, Edge, Graph, Node } from '../../../../../../models/v2';
import { MapGraph } from './map-graph';
import { isNotEmptyArray } from '../../../../../../common';

interface MapConfigProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: Component | undefined;
  subcomponents: Component[] | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  mapConfigComponent: string | undefined;
}

export const MapConfig: FC<MapConfigProps> = (props: MapConfigProps) => {
  const { open, setOpen, setComponent, mapConfigComponent, component, subcomponents } = props;
  const [mapComponent, setMapComponent] = useState<Component | undefined>();

  useEffect(() => {
    if (mapConfigComponent) {
      if (component?.implementation?.type === 'graph') {
        const node = (component?.implementation as Graph)?.nodes?.find((node) => node.id === mapConfigComponent);
        if (typeof node?.node === 'string') {
          const subcomponent = subcomponents?.find((comp) => comp.uid === node.node);
          setMapComponent(subcomponent);
          return;
        }
        setMapComponent(node?.node);
      }
    }
  }, [mapConfigComponent, component, subcomponents]);

  function onClose() {
    function updateMapComponent(nodes: Node[]) {
      const index = nodes?.findIndex((node) => node.id === mapConfigComponent);
      nodes[index].node = mapComponent!;
      return nodes;
    }

    const inputs = mapComponent?.inputs?.map((input) => input.name);
    const outputs = mapComponent?.outputs?.map((output) => output.name);

    function updateMappings(mappings: Edge[], type: 'inputs' | 'outputs' | 'edges') {
      if (type === 'inputs' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter((mapping) =>
          mapping?.target?.node === mapConfigComponent ? inputs?.includes(mapping?.target?.port) : true,
        );
        return updated;
      }
      if (type === 'outputs' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter((mapping) =>
          mapping?.source?.node === mapConfigComponent ? outputs?.includes(mapping?.source?.port) : true,
        );
        return updated;
      }
      if (type === 'edges' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter(
          (edge) =>
            (edge?.source?.node === mapConfigComponent ? outputs?.includes(edge?.source?.port) : true) &&
            (edge?.target?.node === mapConfigComponent ? inputs?.includes(edge?.source?.port) : true),
        );
        return updated;
      }
      return mappings;
    }

    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        nodes: updateMapComponent((prev?.implementation as Graph)?.nodes || []),
        inputMappings: updateMappings((prev?.implementation as Graph)?.inputMappings || [], 'inputs'),
        outputMappings: updateMappings((prev?.implementation as Graph)?.outputMappings || [], 'outputs'),
        edges: updateMappings((prev?.implementation as Graph)?.edges || [], 'edges'),
      },
    }));
    setOpen(false);
  }

  function addParameter(type: 'inputs' | 'outputs') {
    setMapComponent((prev) => ({
      ...prev,
      [type]: [
        ...(prev?.[type] || []),
        {
          name: nanoid(6),
          type: 'parameter',
          mediatype: ['string'],
        },
      ],
    }));
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Grid container sx={{ height: '90vh' }}>
        <Grid item xs={3}>
          <Stack padding="2rem" spacing={4}>
            <Stack sx={{ flexGrow: '1' }} spacing={2}>
              <Typography variant="h5">Inputs</Typography>
              {mapComponent?.inputs?.map((input, index) => (
                <Parameter
                  key={input?.name}
                  parameter={input}
                  type="input"
                  index={index}
                  setComponent={setMapComponent}
                />
              ))}
              <Button variant="ghost" onClick={() => addParameter('inputs')} autoFocus>
                <Icon name="add" />
                Add input
              </Button>
            </Stack>
            <Stack sx={{ flexGrow: '1' }} spacing={2}>
              <Typography variant="h5">Outputs</Typography>
              {mapComponent?.outputs?.map((output, index) => (
                <Parameter
                  key={output?.name}
                  parameter={output}
                  type="output"
                  index={index}
                  setComponent={setMapComponent}
                />
              ))}
              <Button variant="ghost" onClick={() => addParameter('outputs')}>
                <Icon name="add" />
                Add output
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={9}>
          <MapGraph
            component={mapComponent}
            subcomponents={subcomponents}
            setComponent={setMapComponent}
            id={mapConfigComponent!}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};
