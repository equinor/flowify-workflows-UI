import React, { FC } from 'react';
import { Icon } from '@equinor/eds-core-react';
import { ToggleMaskButton } from '../styles';

interface MaskToggleButtonProps {
  masked: boolean;
  setMasked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MaskToggleButton: FC<MaskToggleButtonProps> = (props: MaskToggleButtonProps) => {
  const { masked, setMasked } = props;

  const label = masked ? 'Show password text' : 'Hide password text';

  return (
    <ToggleMaskButton
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setMasked((prev: boolean) => !prev)}
    >
      {masked ? <Icon name="visibility" /> : <Icon name="visibility_off" />}
    </ToggleMaskButton>
  );
};
