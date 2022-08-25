import React, { FC, useEffect, useState } from 'react';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { Dialog, Grid, Stack } from '@mui/material';
import { Component, Edge, Graph, Node } from '../../../../../models/v2';
import { Parameter } from '../../parameter';
import { IfGraph } from './if-graph';
import { nanoid } from '../../../helpers';
import { isNotEmptyArray } from '../../../../../common';
import { Expression } from './expression';
import { ComponentsHandler } from './components-handler';

interface IfConfigProps {
  open: boolean;
  setOpen: any;
  component: Component | undefined;
  subcomponents: Component[] | undefined;
  setComponent: any;
  ifConfigComponent: string | undefined;
  setSubcomponents: any;
  setMarketplaceSnackbar: any;
}

export const IfConfig: FC<IfConfigProps> = (props: IfConfigProps) => {
  const { open, component, ifConfigComponent, subcomponents, setComponent } = props;
  const [ifComponent, setIfComponent] = useState<Component>();

  useEffect(() => {
    if (ifConfigComponent) {
      if (component?.implementation?.type === 'graph') {
        const node = (component?.implementation as Graph)?.nodes?.find((node) => node.id === ifConfigComponent);
        if (typeof node?.node === 'string') {
          const subcomponent = subcomponents?.find((comp) => comp.uid === node.node);
          setIfComponent(subcomponent);
          return;
        }
        setIfComponent(node?.node);
      }
    }
  }, [ifConfigComponent, component, subcomponents]);

  function onClose() {
    function updateIfComponent(nodes: Node[]) {
      const index = nodes?.findIndex((node) => node.id === ifConfigComponent);
      nodes[index].node = ifComponent!;
      return nodes;
    }

    const inputs = ifComponent?.inputs?.map((input) => input.name);
    const outputs = ifComponent?.outputs?.map((output) => output.name);

    function updateMappings(mappings: Edge[], type: 'inputs' | 'outputs' | 'edges') {
      if (type === 'inputs' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter((mapping) =>
          mapping?.target?.node === ifConfigComponent ? inputs?.includes(mapping?.target?.port) : true,
        );
        return updated;
      }
      if (type === 'outputs' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter((mapping) =>
          mapping?.source?.node === ifConfigComponent ? outputs?.includes(mapping?.source?.port) : true,
        );
        return updated;
      }
      if (type === 'edges' && isNotEmptyArray(mappings)) {
        const updated = mappings.filter(
          (edge) =>
            (edge?.source?.node === ifConfigComponent ? outputs?.includes(edge?.source?.port) : true) &&
            (edge?.target?.node === ifConfigComponent ? inputs?.includes(edge?.target?.port) : true),
        );
        return updated;
      }
      return mappings;
    }

    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        nodes: updateIfComponent((prev?.implementation as Graph)?.nodes),
        inputMappings: updateMappings((prev?.implementation as Graph)?.inputMappings, 'inputs'),
        outputMappings: updateMappings((prev?.implementation as Graph)?.outputMappings, 'outputs'),
        edges: updateMappings((prev?.implementation as Graph)?.edges, 'edges'),
      },
    }));

    props.setOpen(false);
  }

  function addParameter(type: 'inputs' | 'outputs') {
    //@ts-expect-error
    setIfComponent((prev: Component) => ({
      ...prev,
      [type]: [
        ...(prev[type] || []),
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
      <Stack sx={{ height: '90vh' }}>
        <Expression ifComponent={ifComponent} setIfComponent={setIfComponent} />
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={3}>
            <Stack padding="2rem" spacing={4}>
              <ComponentsHandler
                ifComponent={ifComponent}
                setIfComponent={setIfComponent}
                setMarketplaceSnackbar={props.setMarketplaceSnackbar}
                setSubcomponents={props.setSubcomponents}
                subcomponents={subcomponents}
              />
              <Stack sx={{ flexGrow: '1' }} spacing={2}>
                <Typography variant="h5">Inputs</Typography>
                {ifComponent?.inputs?.map((input, index) => (
                  <Parameter
                    key={input?.name}
                    parameter={input}
                    type="input"
                    index={index}
                    setComponent={setIfComponent}
                  />
                ))}
                <Button variant="ghost" onClick={() => addParameter('inputs')} autoFocus>
                  <Icon name="add" />
                  Add input
                </Button>
              </Stack>
              <Stack sx={{ flexGrow: '1' }} spacing={2}>
                <Typography variant="h5">Outputs</Typography>
                {ifComponent?.outputs?.map((output, index) => (
                  <Parameter
                    key={output?.name}
                    parameter={output}
                    type="output"
                    index={index}
                    setComponent={setIfComponent}
                  />
                ))}
                <Button variant="ghost" onClick={() => addParameter('outputs')}>
                  <Icon name="add" />
                  Add output
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={9} style={{ height: '100%', width: '100%', backgroundColor: '#eee' }}>
            <IfGraph
              component={ifComponent}
              subcomponents={subcomponents}
              setComponent={setIfComponent}
              id={ifConfigComponent!}
            />
          </Grid>
        </Grid>
      </Stack>
    </Dialog>
  );
};
