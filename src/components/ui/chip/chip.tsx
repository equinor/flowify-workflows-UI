import React, { FC } from 'react';
import { Icon } from '@equinor/eds-core-react';
import { StyledChip } from './styles';
import { ChipProps } from './types';

export const Chip: FC<ChipProps> = (props: ChipProps) => {
  const { children, onClick } = props;
  const isButton = typeof onClick === 'function';
  return (
    <StyledChip
      chipTheme={props.theme!}
      style={props.style}
      as={isButton ? 'button' : 'span'}
      onClick={onClick}
      button={isButton}
    >
      <span>{children}</span>
      {isButton && <Icon name="close" size={16} />}
    </StyledChip>
  );
};

Chip.defaultProps = {
  onClick: undefined,
  theme: 'default',
};
