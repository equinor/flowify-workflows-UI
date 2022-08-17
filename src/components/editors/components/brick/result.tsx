import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Dialog, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Brick, Component, Data, FilePath, Result as IResult, Workflow } from '../../../../models/v2';

const ResultWrapper = styled.div`
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

interface ResultProps {
  result: IResult;
  outputs?: Data[];
  index: number;
  setComponent?: any;
  setWorkflow?: any;
}

export const Result: FC<ResultProps> = (props: ResultProps) => {
  const { outputs, result, setComponent, index, setWorkflow } = props;
  const [open, setOpen] = useState<boolean>(false);
  const isPath = !(typeof result?.source === 'string');
  const [isFilePath, setIsFilePath] = useState(isPath);
  const [inputValue, setInputValue] = useState(isPath ? (result?.source as FilePath)?.file : result?.source);
  const [selectValue, setSelectValue] = useState(result?.target?.port || '');

  function updateValues(list: IResult[]) {
    if (isFilePath) {
      //@ts-expect-error
      list[index] = { source: { file: inputValue }, target: { port: selectValue } };
      return list;
    }
    list[index] = { source: inputValue, target: { port: selectValue } };
    return list;
  }

  function onChange() {
    if (typeof setComponent === 'function') {
      setComponent((prev: Component) => ({
        ...prev,
        implementation: {
          ...prev.implementation,
          results: updateValues((prev.implementation as Brick).results!),
        },
      }));
      return;
    }
    if (typeof setWorkflow === 'function') {
      setWorkflow((prev: Workflow) => ({
        ...prev,
        component: {
          ...prev.component,
          implementation: {
            ...prev.component.implementation,
            results: updateValues((prev.component.implementation as Brick).results!),
          },
        },
      }));
    }
  }

  return (
    <ResultWrapper>
      <Dialog open={open} onClose={() => onChange()} fullWidth maxWidth="sm">
        <Stack sx={{ padding: '2rem' }} spacing={2}>
          <Typography variant="h6">Edit result</Typography>
          <Stack>
            <Typography variant="caption">Source type</Typography>
            <Stack direction="row" spacing={2}>
              <Radio label="Constant" value="constant" checked={!isFilePath} onChange={() => setIsFilePath(false)} />
              <Radio label="File path" value="parameter" checked={isFilePath} onChange={() => setIsFilePath(true)} />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="caption">{isFilePath ? 'Source file path' : 'Source'}</Typography>
            <TextField value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="caption">Target port</Typography>
            <Select label="Target port" value={selectValue} onChange={(event) => setSelectValue(event.target.value)}>
              {outputs?.map((output) => (
                <MenuItem key={output.name} value={output.name}>
                  {output.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
      </Dialog>
      <ArgumentButton onClick={() => setOpen(true)}>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Typography variant="h6">
            {isPath ? (result?.source as FilePath)?.file || 'undefined' : (result?.source as string) || 'undefined'}
          </Typography>
          <Icon name="chevron_right" />
          <Typography variant="h6">{result?.target?.port || 'undefined'}</Typography>
        </Stack>
      </ArgumentButton>
    </ResultWrapper>
  );
};
