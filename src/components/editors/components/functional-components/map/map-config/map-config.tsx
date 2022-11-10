import React, { FC, useEffect, useState } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Component, Edge, Graph, Node } from '@models/v2';
import { isNotEmptyArray, nanoid, getComponentFromRef } from '@common';
import { DialogWrapper, Button, Stack, Grid, Modal } from '@ui';
import { Parameter } from '../../..';
import { MapGraph } from './map-graph';

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
        const subcomponent = getComponentFromRef(node?.node!, subcomponents || []);
        setMapComponent(subcomponent);
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
            (edge?.target?.node === mapConfigComponent ? inputs?.includes(edge?.target?.port) : true),
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
    <Modal open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogWrapper>
        <Grid
          container
          style={{
            flexGrow: '1',
            minHeight: '0',
            flexWrap: 'nowrap',
            height: '100%',
            width: '100%',
            maxHeight: '90vh',
          }}
        >
          <Grid item xs={3} style={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
            <Stack padding={1} spacing={2}>
              <Stack style={{ flexGrow: '1' }} spacing={1}>
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
                <Button theme="simple" leftIcon="add" onClick={() => addParameter('inputs')} autoFocus>
                  Add input
                </Button>
              </Stack>
              <Stack style={{ flexGrow: '1' }} spacing={1}>
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
                <Button theme="simple" leftIcon="add" onClick={() => addParameter('outputs')}>
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
      </DialogWrapper>
    </Modal>
  );
};
