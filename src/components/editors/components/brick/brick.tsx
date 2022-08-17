import React, { FC } from 'react';
import { Grid, Stack, TextField } from '@mui/material';
import { Component, Brick as IBrick } from '../../../../models/v2';
import { Button, Typography } from '@equinor/eds-core-react';
import { Argument, DraggableList, Result } from '../../components';

interface BrickProps {
  component: Component | null | undefined;
  setComponent: any;
  onSave: any;
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
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        container: {
          ...(prev.implementation as IBrick).container,
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
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        container: {
          ...(prev.implementation as IBrick).container,
          command: list,
        },
      },
    }));
  }

  function commandOnBlur(event: any, index: number) {
    const { value } = event.target;
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        container: {
          ...(prev.implementation as IBrick).container,
          command: updateStringValueInArray((prev.implementation as IBrick).container?.command!, index, value),
        },
      },
    }));
  }

  function addCommand() {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        container: {
          ...(prev.implementation as IBrick).container,
          command: [...((prev.implementation as IBrick).container?.command || ''), ''],
        },
      },
    }));
  }

  function argsHandler(list: object[]) {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        args: list,
      },
    }));
  }

  function addArgument() {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        args: [...((prev.implementation as IBrick).args || ''), { source: '' }],
      },
    }));
  }

  function resultHandler(list: object[]) {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        results: list,
      },
    }));
  }

  function addResult() {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        results: [...((prev.implementation as IBrick).results || ''), { source: '', target: { port: '' } }],
      },
    }));
  }

  return (
    <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      {type === 'brick' && (
        <>
          <Grid item xs={6} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
            <Stack spacing={2} sx={{ padding: '2rem' }}>
              <Typography variant="h4">Container</Typography>
              <div>
                <Typography variant="h6">Name</Typography>
                <TextField
                  defaultValue={brick?.container?.name}
                  onBlur={(event) => updateContainerStringValue(event, 'name')}
                  fullWidth
                />
              </div>
              <div>
                <Typography variant="h6">Image</Typography>
                <TextField
                  defaultValue={brick?.container?.image}
                  onBlur={(event) => updateContainerStringValue(event, 'image')}
                  fullWidth
                />
              </div>
              <DraggableList
                label="Command"
                type="command"
                onChange={commandHandler}
                list={brick?.container?.command}
                addItem={addCommand}
                child={(item, index) => (
                  <TextField fullWidth defaultValue={item} onBlur={(event) => commandOnBlur(event, index)} />
                )}
              />
              <DraggableList
                label="Args"
                type="argument"
                onChange={argsHandler}
                list={brick?.args}
                addItem={addArgument}
                child={(item, index) => (
                  <Argument arg={item} inputs={component.inputs} index={index} setComponent={setComponent} />
                )}
              />
              <DraggableList
                label="Results"
                type="result"
                onChange={resultHandler}
                list={brick?.results}
                addItem={addResult}
                child={(item, index) => (
                  <Result result={item} index={index} outputs={component.outputs} setComponent={setComponent} />
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={6} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
            <Button onClick={props.onSave} style={{ position: 'absolute', right: 16, marginTop: 16 }}>
              Save changes
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};
