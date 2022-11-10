import React, { FC, useState } from 'react';
import { Tooltip } from '@equinor/eds-core-react';
import { Button } from '@ui';
import { AddButtonProps, BUTTON_STATE } from './types';

export type { BUTTON_STATE };

export const AddButton: FC<AddButtonProps> = (props: AddButtonProps) => {
  const { onAddComponent, component } = props;
  const [buttonState, setButtonState] = useState<BUTTON_STATE>('default');

  async function onAdd() {
    if (buttonState === 'loading') {
      return;
    }
    setButtonState('loading');
    onAddComponent(component, setButtonState);
  }

  return (
    <Tooltip title="Add component to workflow">
      <Button
        onClick={onAdd}
        theme="icon"
        icon={
          buttonState === 'loading'
            ? undefined
            : buttonState === 'success'
            ? 'check'
            : buttonState === 'error'
            ? 'close'
            : 'add'
        }
        loading={buttonState === 'loading'}
      />
    </Tooltip>
  );
};
