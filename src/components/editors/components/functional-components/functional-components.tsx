import React, { FC, useState } from 'react';
import { Dialog, Grid, Stack } from '@mui/material';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { ComponentCard } from '../../../ui';
import { isNotEmptyArray } from '../../../../common';
import { Component, Graph } from '../../../../models/v2';
import { generateIf } from './helpers/generators';
import { MapCreator } from './creators/map-creator';

interface FunctionalComponentsProps {
  open: boolean;
  setOpen: any;
  component?: Component;
  subComponents?: Component[];
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
}

type COMPONENT_IDS = 'map' | 'if';

interface IFunctionalComponent {
  id: COMPONENT_IDS;
  name: string;
  type: 'map' | 'conditional';
  description: string;
  onAdd: string;
}

const FUNCTIONAL_COMPONENTS: IFunctionalComponent[] = [
  {
    id: 'map',
    name: 'Map component',
    type: 'map',
    description: 'Wrap component in a map and use parameter arrays to run it multiple times when running jobs.',
    onAdd: 'onAddMap',
  },
  {
    id: 'if',
    name: 'If component',
    type: 'conditional',
    description:
      'Select component to run if condition is true, additionally select component to run if condition is false',
    onAdd: 'onAddIf',
  },
];

export const FunctionalComponents: FC<FunctionalComponentsProps> = (props: FunctionalComponentsProps) => {
  const { component, subComponents, setComponent, setOpen } = props;
  const [activeComponent, setActiveComponent] = useState<COMPONENT_IDS>();

  function onClose() {
    setActiveComponent(undefined);
    setOpen(false);
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
      <Dialog open={props.open} onClose={onClose} fullWidth maxWidth="lg">
        {!activeComponent && (
          <Stack sx={{ padding: '2rem' }} rowGap={3}>
            <Typography variant="h3">Functional components</Typography>
            <Grid container justifyContent="flex-start" spacing={2}>
              {isNotEmptyArray(FUNCTIONAL_COMPONENTS) &&
                FUNCTIONAL_COMPONENTS.map((component) => (
                  <Grid key={component.name} item xs={4}>
                    <ComponentCard>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Stack spacing={2}>
                          <Icon name="formula" size={16} color="#004f55" />
                          <Typography variant="body_short_bold">{component.name}</Typography>
                          <Typography variant="body_short">{component.description}</Typography>
                        </Stack>
                        <Button
                          style={{ flexShrink: '0' }}
                          variant="ghost_icon"
                          onClick={() => addFunctions[component.onAdd]()}
                        >
                          <Icon name="add" />
                        </Button>
                      </Stack>
                    </ComponentCard>
                  </Grid>
                ))}
            </Grid>
          </Stack>
        )}
        {activeComponent === 'map' && (
          <MapCreator
            component={component}
            subcomponents={subComponents}
            setComponent={setComponent}
            onClose={onClose}
          />
        )}
      </Dialog>
    </>
  );
};
