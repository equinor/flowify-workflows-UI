import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Dialog, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Arg, Brick, Component, Data, Port } from '../../../../models/v2';
import { Storage } from '@mui/icons-material';

interface ArgumentProps {
  arg: Arg;
  inputs?: Data[];
  index: number;
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
}

const ArgumentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  align-items: center;
  padding: 0rem 1rem;
  flex-grow: 2;
`;

const ArgumentButton = styled.button`
  background-color: #ade2e619;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  column-gap: 1rem;
  flex-grow: 2;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #deedee;
  }
`;

const TYPE_ICONS = {
  parameter: 'swap_horizontal',
  artifact: 'file',
  env_secret: 'security',
};

export const Argument: FC<ArgumentProps> = (props: ArgumentProps) => {
  const { arg, inputs, setComponent, index } = props;
  const [open, setOpen] = useState<boolean>(false);
  const isConst = typeof arg?.source === 'string';
  const [isConstant, setIsConstant] = useState<boolean>(isConst);
  const [prefixValue, setPrefixValue] = useState<string>(arg?.target?.prefix || '');
  const [suffixValue, setSuffixValue] = useState<string>(arg?.target?.suffix || '');
  const [inputValue, setInputValue] = useState<any>(isConst ? arg?.source : '');
  const [selectValue, setSelectValue] = useState<string | undefined>(isConst ? '' : (arg?.source as Port)?.port);
  const [type, setType] = useState<string>('');

  useEffect(() => {
    const inputType = inputs?.find((input) => input.name === selectValue)?.type;
    setType(inputType || '');
  }, [selectValue, inputs]);

  function updateValue(list: object[]) {
    if (isConstant) {
      list[index] = { source: inputValue };
      return list;
    }
    list[index] = { source: { port: selectValue }, target: { type, prefix: prefixValue, suffix: suffixValue } };
    return list;
  }

  function onChange() {
    if (typeof setComponent === 'function') {
      setComponent((prev) => ({
        ...prev,
        implementation: {
          ...prev?.implementation,
          args: updateValue((prev?.implementation as Brick)?.args || []),
        },
      }));
    }
  }

  const selectedInputType = inputs?.find((input) => input.name === selectValue)?.type;

  return (
    <ArgumentWrapper>
      <Dialog open={open} onClose={() => onChange()} fullWidth maxWidth="sm">
        <Stack sx={{ padding: '2rem' }} spacing={2}>
          <Typography variant="h5">Edit argument</Typography>
          <Stack direction="row" spacing={2}>
            <Radio label="Constant" value="constant" checked={isConstant} onChange={() => setIsConstant(true)} />
            <Radio
              label="Parameter input"
              value="parameter"
              checked={!isConstant}
              onChange={() => setIsConstant(false)}
            />
          </Stack>
          {!isConstant && (
            <div>
              <Typography variant="h6">Prefix</Typography>
              <TextField fullWidth value={prefixValue} onChange={(event) => setPrefixValue(event.target.value)} />
            </div>
          )}
          <div>
            <Typography variant="h6">{isConstant ? 'Source' : 'Source input'}</Typography>
            {isConstant ? (
              <TextField fullWidth value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            ) : (
              <Select fullWidth value={selectValue} onChange={(event) => setSelectValue(event.target.value)}>
                {inputs?.map((input) => (
                  <MenuItem key={input.name} value={input.name}>
                    {input.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          {!isConstant && (
            <div>
              <Typography variant="h6">Suffix</Typography>
              <TextField fullWidth value={suffixValue} onChange={(event) => setSuffixValue(event.target.value)} />
            </div>
          )}
          {selectedInputType === 'volume' && (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ background: '#ADE2E619', padding: '1rem' }}>
              <Icon name="info_circle" color="#007079" />
              <Typography variant="body_short">
                <b>Mount path: </b>
                <br />
                {prefixValue}
                {selectValue}
                {suffixValue}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Dialog>
      <ArgumentButton onClick={() => setOpen(true)}>
        {isConst ? (
          <Icon name="text_field" />
        ) : type === 'volume' ? (
          <Storage />
        ) : (
          <Icon name={TYPE_ICONS[type as keyof typeof TYPE_ICONS] || 'swap_horizontal'} />
        )}
        <Stack direction="column" justifyContent="space-between">
          <Typography variant="h6">
            {isConst
              ? arg.source
                ? (arg.source as string)
                : 'undefined'
              : (arg.source as Port)?.port
              ? (arg.source as Port)?.port
              : 'undefined'}
          </Typography>
        </Stack>
      </ArgumentButton>
    </ArgumentWrapper>
  );
};
