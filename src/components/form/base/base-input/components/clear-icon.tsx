import React, { FC } from 'react';
import { Icon } from '@equinor/eds-core-react';
import { ClearIconWrapper } from '../styles';

interface ClearIconProps {
  clearValue: () => void;
  inputRef: any;
}

export const ClearIcon: FC<ClearIconProps> = (props: ClearIconProps) => {
  const { clearValue, inputRef } = props;

  function clearInput() {
    if (inputRef.current) {
      clearValue();
      inputRef.current.focus();
    }
  }

  return (
    <ClearIconWrapper>
      <Icon
        name="clear"
        tabIndex={0}
        role="button"
        aria-label="Clear all"
        onClick={clearValue}
        onKeyDown={(event) => {
          if (event.key && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            clearInput();
          }
        }}
      />
    </ClearIconWrapper>
  );
};
