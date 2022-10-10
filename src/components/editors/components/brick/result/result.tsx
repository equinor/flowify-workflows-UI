import React, { FC, useState } from 'react';
import { Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Dialog, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ResultProps } from './types';
import { ResultButton, ResultWrapper } from './styles';
import { Brick, FilePath, Result as IResult } from '../../../../../models/v2';

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
      setComponent((prev) => ({
        ...prev,
        implementation: {
          ...prev?.implementation,
          results: updateValues((prev?.implementation as Brick)?.results || []),
        },
      }));
      return;
    }
    if (typeof setWorkflow === 'function') {
      setWorkflow((prev) => ({
        ...prev,
        component: {
          ...prev?.component,
          implementation: {
            ...prev?.component?.implementation,
            results: updateValues((prev?.component?.implementation as Brick)?.results || []),
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
      <ResultButton onClick={() => setOpen(true)}>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Typography variant="h6">
            {isPath ? (result?.source as FilePath)?.file || 'undefined' : (result?.source as string) || 'undefined'}
          </Typography>
          <Icon name="chevron_right" />
          <Typography variant="h6">{result?.target?.port || 'undefined'}</Typography>
        </Stack>
      </ResultButton>
    </ResultWrapper>
  );
};
