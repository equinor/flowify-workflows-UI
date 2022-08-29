import React, { FC, useEffect, useState } from 'react';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { Dialog, Grid, Stack } from '@mui/material';
import { Component, Conditional, Graph } from '../../../../../models/v2';
import { MultiToggle, Select, TextField, ToggleButton } from '../../../../ui';
import { IfGraph } from './if-graph';
import { MarketplaceModal, Parameter } from '../..';

interface IfConfigProps {
  open: boolean;
  setOpen: any;
  component: Component | undefined;
  subcomponents: Component[] | undefined;
  setComponent: any;
  ifConfigComponent: string | undefined;
}

const OPERATORS = [
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '<=', value: '<=' },
  { label: '>=', value: '>=' },
  { label: '<', value: '<' },
  { label: '>', value: '>' },
];

export const IfConfig: FC<IfConfigProps> = (props: IfConfigProps) => {
  const { open, component, ifConfigComponent, subcomponents } = props;
  const [ifComponent, setIfComponent] = useState<Component>();
  const [openMarketplace, setOpenMarketplace] = useState<'trueNode' | 'falseNode'>();
  const [leftType, setLeftType] = useState<'custom' | 'input'>();
  const [rightType, setRightType] = useState<'custom' | 'input'>(
    typeof (ifComponent?.implementation as Conditional)?.expression?.right === 'string' ? 'custom' : 'input',
  );

  useEffect(() => {
    if (ifConfigComponent) {
      if (component?.implementation?.type === 'graph') {
        const node = (component?.implementation as Graph)?.nodes?.find((node) => node.id === ifConfigComponent);
        if (typeof node?.node === 'string') {
          const subcomponent = subcomponents?.find((comp) => comp.uid === node.node);
          setIfComponent(subcomponent);
          setLeftType(
            typeof (subcomponent?.implementation as Conditional)?.expression?.left === 'string' ? 'custom' : 'input',
          );
          setRightType(
            typeof (subcomponent?.implementation as Conditional)?.expression?.right === 'string' ? 'custom' : 'input',
          );
          return;
        }
        setLeftType(
          typeof (node?.node?.implementation as Conditional)?.expression?.left === 'string' ? 'custom' : 'input',
        );
        setRightType(
          typeof (node?.node?.implementation as Conditional)?.expression?.right === 'string' ? 'custom' : 'input',
        );
        setIfComponent(node?.node);
      }
    }
  }, [ifConfigComponent, component, subcomponents]);

  function onClose() {
    props.setOpen(false);
  }

  function addParameter(type: 'inputs' | 'outputs') {}

  const { left, right, operator } = (ifComponent?.implementation as Conditional)?.expression || {};

  const leftExpressionValue = typeof left === 'string' ? left : left?.name;
  const rightExpressionValue = typeof right === 'string' ? right : right?.name;

  function changeType(side: 'left' | 'right', type: 'custom' | 'input') {
    if (side === 'left') {
      setLeftType(type);
    }
    if (side === 'right') {
      setRightType(type);
    }
    // @ts-ignore
    setIfComponent((prev) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        expression: {
          ...(prev?.implementation as Conditional)?.expression,
          [side]: '',
        },
      },
    }));
  }

  function onValueChange(value: string, side: 'left' | 'operator' | 'right') {
    function getValue() {
      if (side === 'left') {
        const val = leftType === 'custom' ? value : ifComponent?.inputs?.find((input) => input.name === value);
        return val;
      }
      if (side === 'right') {
        const val = rightType === 'custom' ? value : ifComponent?.inputs?.find((input) => input.name === value);
        return val;
      }
      return value;
    }
    //@ts-expect-error
    setIfComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        expression: {
          ...(prev?.implementation as Conditional)?.expression,
          [side]: getValue(),
        },
      },
    }));
  }

  function addComponent(component: Component, setButtonState: any) {}

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Stack sx={{ height: '90vh' }}>
        <Stack padding="2rem" spacing={1}>
          <Typography variant="h5">Expression</Typography>
          <Stack direction="row" spacing={6}>
            <Stack direction="row" spacing={2}>
              <MultiToggle label="Left expression">
                <ToggleButton onClick={() => changeType('left', 'input')} active={leftType === 'input'}>
                  Select input
                </ToggleButton>
                <ToggleButton onClick={() => changeType('left', 'custom')} active={leftType === 'custom'}>
                  Custom value
                </ToggleButton>
              </MultiToggle>
              {leftType === 'input' ? (
                <Select
                  id="left_selection"
                  aria-label="Left expression"
                  options={ifComponent?.inputs?.map((input) => ({ label: input.name, value: input.name })) || []}
                  value={leftExpressionValue || ''}
                  onChange={(event: any) => onValueChange(event.target.value, 'left')}
                  placeholder="Select from inputs"
                  label="&nbsp;"
                />
              ) : (
                <TextField
                  label="&nbsp;"
                  id="left_value"
                  aria-label="Left expression custom value"
                  defaultValue={leftExpressionValue}
                  onBlur={(event: any) => onValueChange(event.target.value, 'left')}
                />
              )}
            </Stack>
            <Select
              id="operator_selection"
              label="Operator"
              options={OPERATORS}
              value={operator || ''}
              onChange={(event: any) => onValueChange(event.target.value, 'operator')}
            />
            <Stack direction="row" spacing={2}>
              <MultiToggle label="Right expression">
                <ToggleButton onClick={() => changeType('right', 'input')} active={rightType === 'input'}>
                  Select input
                </ToggleButton>
                <ToggleButton onClick={() => changeType('right', 'custom')} active={rightType === 'custom'}>
                  Custom value
                </ToggleButton>
              </MultiToggle>
              {rightType === 'input' ? (
                <Select
                  id="right_selection"
                  aria-label="Right"
                  options={ifComponent?.inputs?.map((input) => ({ label: input.name, value: input.name })) || []}
                  value={rightExpressionValue || ''}
                  onChange={(event: any) => onValueChange(event.target.value, 'right')}
                  placeholder="Select from inputs"
                  label="&nbsp;"
                />
              ) : (
                <TextField
                  label="&nbsp;"
                  id="right_value"
                  aria-label="Right expression custom value"
                  defaultValue={rightExpressionValue}
                  onBlur={(event: any) => onValueChange(event.target.value, 'right')}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={3}>
            <Stack padding="2rem" spacing={4}>
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
              setOpenMarketplace={setOpenMarketplace}
            />
            <MarketplaceModal
              open={openMarketplace !== undefined}
              onClose={() => setOpenMarketplace(undefined)}
              onAddComponent={addComponent}
            />
          </Grid>
        </Grid>
      </Stack>
    </Dialog>
  );
};
