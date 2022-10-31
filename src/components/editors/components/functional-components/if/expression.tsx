import React, { FC, useState } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Component, Conditional } from '../../../../../models/v2';
import { MultiToggle, ToggleButton, Stack } from '../../../../ui';
import { BaseInput, Select } from '../../../../form';

interface ExpressionProps {
  ifComponent: Component | undefined;
  setIfComponent: any;
}

const OPERATORS = [
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '<=', value: '<=' },
  { label: '>=', value: '>=' },
  { label: '<', value: '<' },
  { label: '>', value: '>' },
];

export const Expression: FC<ExpressionProps> = (props: ExpressionProps) => {
  const { ifComponent, setIfComponent } = props;
  const [leftType, setLeftType] = useState<'custom' | 'input'>(
    typeof (ifComponent?.implementation as Conditional)?.expression?.left === 'string' ? 'custom' : 'input',
  );
  const [rightType, setRightType] = useState<'custom' | 'input'>(
    typeof (ifComponent?.implementation as Conditional)?.expression?.right === 'string' ? 'custom' : 'input',
  );
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

    setIfComponent((prev: Component) => ({
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

  return (
    <Stack padding={1} spacing={0.5}>
      <Typography variant="h5">Expression</Typography>
      <Stack direction="row" spacing={3}>
        <Stack direction="row" spacing={1.5}>
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
              name="left_selection"
              aria-label="Left expression"
              options={ifComponent?.inputs?.map((input) => ({ label: input.name!, value: input.name! })) || []}
              value={leftExpressionValue || ''}
              onChange={(item) => onValueChange(item, 'left')}
              placeholder="Select from inputs"
              label="&nbsp;"
            />
          ) : (
            <BaseInput
              label="&nbsp;"
              name="left_value"
              aria-label="Left expression custom value"
              defaultValue={leftExpressionValue}
              onBlur={(event: any) => onValueChange(event.target.value, 'left')}
            />
          )}
        </Stack>
        <Select
          name="operator_selection"
          label="Operator"
          options={OPERATORS}
          value={operator || ''}
          onChange={(item) => onValueChange(item, 'operator')}
        />
        <Stack direction="row" spacing={1}>
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
              name="right_selection"
              aria-label="Right"
              options={ifComponent?.inputs?.map((input) => ({ label: input.name!, value: input.name! })) || []}
              value={rightExpressionValue || ''}
              onChange={(item) => onValueChange(item, 'right')}
              placeholder="Select from inputs"
              label="&nbsp;"
            />
          ) : (
            <BaseInput
              label="&nbsp;"
              name="right_value"
              aria-label="Right expression custom value"
              defaultValue={rightExpressionValue}
              onBlur={(event: any) => onValueChange(event.target.value, 'right')}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
