import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Component, Brick as IBrick } from '@models/v2';
import { BaseInput } from '@form';
import { Stack, Grid } from '@ui';
import { Argument, DraggableList, Result } from '../../components';

interface BrickProps {
  component: Component | null | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
}

export const Brick: FC<BrickProps> = (props: BrickProps) => {
  const { component, setComponent } = props;
  if (!component) {
    return null;
  }

  const { implementation } = component;

  if (!implementation) {
    return null;
  }

  const { type } = implementation;

  const brick = implementation as IBrick;

  function updateContainerStringValue(event: any, name: string) {
    const { value } = event.target;
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        container: {
          ...(prev?.implementation as IBrick).container,
          [name]: value,
        },
      },
    }));
  }

  const updateStringValueInArray = (list: string[], index: number, value: string) => {
    list[index] = value;
    return list;
  };

  function commandHandler(list: any[]) {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        container: {
          ...(prev?.implementation as IBrick).container,
          command: list,
        },
      },
    }));
  }

  function commandOnBlur(event: any, index: number) {
    const { value } = event.target;
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        container: {
          ...(prev?.implementation as IBrick).container,
          command: updateStringValueInArray((prev?.implementation as IBrick).container?.command || [], index, value),
        },
      },
    }));
  }

  function addCommand() {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        container: {
          ...(prev?.implementation as IBrick).container,
          command: [...((prev?.implementation as IBrick).container?.command || ''), ''],
        },
      },
    }));
  }

  function argsHandler(list: object[]) {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        args: list,
      },
    }));
  }

  function addArgument() {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        args: [...((prev?.implementation as IBrick).args || []), { source: '' }],
      },
    }));
  }

  function resultHandler(list: object[]) {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        results: list,
      },
    }));
  }

  function addResult() {
    setComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        results: [...((prev?.implementation as IBrick).results || []), { source: '', target: { port: '' } }],
      },
    }));
  }

  return (
    <Grid container style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      {type === 'brick' && (
        <>
          <Grid item xs={12} l={7} style={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
            <Stack spacing={1} padding={2}>
              <Typography variant="h4">Container</Typography>
              <BaseInput
                label="Name"
                name="container_name"
                id="container_name"
                defaultValue={brick?.container?.name}
                onBlur={(event) => updateContainerStringValue(event, 'name')}
              />
              <BaseInput
                label="Image"
                name="container_image"
                id="container_image"
                defaultValue={brick?.container?.image}
                onBlur={(event) => updateContainerStringValue(event, 'image')}
              />
              <DraggableList
                label="Command"
                id="command"
                addButtonLabel="Add command"
                onChange={commandHandler}
                list={brick?.container?.command}
                addItem={addCommand}
                child={(item, index) => (
                  <BaseInput
                    id={`command_item_${item}`}
                    name={`command_item_${item}`}
                    defaultValue={item}
                    onBlur={(event) => commandOnBlur(event, index)}
                  />
                )}
              />
              <DraggableList
                label="Args"
                id="args"
                addButtonLabel="Add argument"
                onChange={argsHandler}
                list={brick?.args}
                addItem={addArgument}
                child={(item, index) => (
                  <Argument arg={item} inputs={component.inputs} index={index} setComponent={setComponent} />
                )}
              />
              <DraggableList
                label="Results"
                id="result"
                addButtonLabel="Add result"
                onChange={resultHandler}
                list={brick?.results}
                addItem={addResult}
                child={(item, index) => (
                  <Result result={item} index={index} outputs={component.outputs} setComponent={setComponent} />
                )}
              />
            </Stack>
          </Grid>
          <Grid xs={0} l={5} style={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}></Grid>
        </>
      )}
    </Grid>
  );
};
