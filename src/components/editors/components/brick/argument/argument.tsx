import React, { FC, useEffect, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Storage } from '@mui/icons-material';
import { TYPE_ICONS, ArgumentProps } from './types';
import { ArgumentButton } from './styles';
import { Port } from '../../../../../models/v2';
import { ArgumentEditor } from './argument-editor/argument-editor';

export const Argument: FC<ArgumentProps> = (props: ArgumentProps) => {
  const { arg, inputs } = props;
  const [open, setOpen] = useState<boolean>(false);
  const isConst = typeof arg?.source === 'string';
  const [selectValue, setSelectValue] = useState<string | undefined>(isConst ? '' : (arg?.source as Port)?.port);
  const [type, setType] = useState<string>('');

  useEffect(() => {
    const inputType = inputs?.find((input) => input.name === selectValue)?.type;
    setType(inputType || '');
  }, [selectValue, inputs]);

  return (
    <>
      {open && (
        <ArgumentEditor
          arg={arg}
          index={props.index}
          inputs={inputs || []}
          isConst={isConst}
          onClose={() => setOpen(false)}
          open={open}
          setComponent={props.setComponent!}
          selectValue={selectValue}
          setSelectValue={setSelectValue}
          type={type}
        />
      )}
      <ArgumentButton onClick={() => setOpen(true)}>
        {isConst ? (
          <Icon name="text_field" />
        ) : type === 'volume' ? (
          <Storage />
        ) : (
          <Icon name={TYPE_ICONS[type as keyof typeof TYPE_ICONS] || 'swap_horizontal'} />
        )}
        <Typography variant="h6">
          {isConst
            ? arg.source
              ? (arg.source as string)
              : 'undefined'
            : (arg.source as Port)?.port
            ? (arg.source as Port)?.port
            : 'undefined'}
        </Typography>
      </ArgumentButton>
    </>
  );
};
