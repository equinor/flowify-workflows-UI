import React, { FC, useState } from 'react';
import { Radio, Typography } from '@equinor/eds-core-react';
import { ArgumentEditorProps } from './types';
import { Brick } from '../../../../../../models/v2';
import { BaseInput, Select } from '../../../../../form';
import { DialogWrapper, Message, Stack, Modal } from '../../../../../ui';

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
  const inputOptions = inputs?.map((input) => ({ label: input?.name || '', value: input?.name || '' }));

  return (
    <Modal open={open} onClose={() => onChange()} fullWidth maxWidth="sm">
      <DialogWrapper padding={2} spacing={2}>
        <Typography variant="h5">Edit argument</Typography>
        <Stack direction="row" spacing={1.5}>
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
              name="source_input"
              label="Source input"
              value={selectValue}
              onChange={(item) => setSelectValue(item)}
              options={inputOptions || []}
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
          <Message icon="info_circle">
            <Typography variant="body_short">
              <b>Mount path: </b>
              <br />
              {prefixValue}[input:{selectValue} value]
              {suffixValue}
            </Typography>
          </Message>
        )}
      </DialogWrapper>
    </Modal>
  );
};
