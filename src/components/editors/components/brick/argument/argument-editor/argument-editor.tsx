import React, { FC, useState } from 'react';
import { Icon, Radio, Typography } from '@equinor/eds-core-react';
import { Dialog, MenuItem, Stack } from '@mui/material';
import { ArgumentEditorProps } from './types';
import { Brick } from '../../../../../../models/v2';
import { EditorWrapper } from './styles';
import { BaseInput } from '../../../../../form/base';
import { Select } from '../../../../../ui';

export const ArgumentEditor: FC<ArgumentEditorProps> = (props: ArgumentEditorProps) => {
  const { arg, isConst, index, open, onClose, setComponent, inputs, selectValue, setSelectValue, type } = props;

  const [isConstant, setIsConstant] = useState<boolean>(isConst);
  const [prefixValue, setPrefixValue] = useState<string>(arg?.target?.prefix || '');
  const [suffixValue, setSuffixValue] = useState<string>(arg?.target?.suffix || '');
  const [inputValue, setInputValue] = useState<any>(isConst ? arg?.source : '');

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
    onClose();
  }

  const selectedInputType = inputs?.find((input) => input.name === selectValue)?.type;
  const inputOptions = inputs?.map((input) => ({ label: input?.name, value: input?.name }));

  return (
    <Dialog open={open} onClose={() => onChange()} fullWidth maxWidth="sm">
      <EditorWrapper padding={2} spacing={2}>
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
          <BaseInput
            name="prefix"
            label="Prefix"
            value={prefixValue}
            onChange={(event: any) => setPrefixValue(event.target.value)}
          />
        )}
        <div>
          {isConstant ? (
            <BaseInput
              name="source_const"
              label="Source"
              value={inputValue}
              onChange={(event: any) => setInputValue(event.target.value)}
            />
          ) : (
            <Select
              label="Source input"
              value={selectValue}
              onChange={(event: any) => setSelectValue(event.target.value)}
              options={inputOptions}
            />
          )}
        </div>
        {!isConstant && (
          <BaseInput
            label="Suffix"
            name="suffix"
            value={suffixValue}
            onChange={(event: any) => setSuffixValue(event.target.value)}
          />
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
      </EditorWrapper>
    </Dialog>
  );
};
