import React, { FC, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Paper, Stack, Button, Grid } from '@ui';
import { isNotEmptyArray } from '@common';
import { Graph } from '@models/v2';
import { generateIf } from './helpers';
import { MapCreator } from './map/map-creator/map-creator';
import { FunctionalComponentsProps, COMPONENT_IDS, FUNCTIONAL_COMPONENTS } from './types';

export const FunctionalComponents: FC<FunctionalComponentsProps> = (props: FunctionalComponentsProps) => {
  const { component, subComponents, setComponent } = props;
  const [activeComponent, setActiveComponent] = useState<COMPONENT_IDS>();

  function onClose() {
    setActiveComponent(undefined);
    props.onClose();
  }

  function onAddMap() {
    setActiveComponent('map');
  }

  function onAddIf() {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        nodes: generateIf((prev?.implementation as Graph)?.nodes || []),
      },
    }));
    onClose();
  }

  const addFunctions: any = { onAddMap, onAddIf };

  return (
    <>
      {!activeComponent && (
        <Grid container justifyContent="flex-start" spacing={1}>
          {isNotEmptyArray(FUNCTIONAL_COMPONENTS) &&
            FUNCTIONAL_COMPONENTS.map((component) => (
              <Grid key={component.name} item xs={4}>
                <Paper
                  theme="light"
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  padding={1.5}
                  style={{ height: '100%' }}
                >
                  <Stack spacing={1}>
                    <Icon name="formula" size={16} color="#004f55" />
                    <Typography variant="body_short_bold">{component.name}</Typography>
                    <Typography variant="body_short">{component.description}</Typography>
                  </Stack>
                  <Button
                    style={{ flexShrink: '0' }}
                    theme="icon"
                    onClick={() => addFunctions[component.onAdd]()}
                    icon="add"
                    aria-label={`Add ${component?.name} to graph`}
                  />
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      {activeComponent === 'map' && (
        <MapCreator component={component} subcomponents={subComponents} setComponent={setComponent} onClose={onClose} />
      )}
    </>
  );
};
