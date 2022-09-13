import React, { FC } from 'react';
import { StyledButton } from './styles';
import { ButtonProps } from './types';

export const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const { children, theme, as, ...buttonProps } = props;
  return (
    <StyledButton as={as || (buttonProps?.href ? 'a' : 'button')} theme={theme} type="button" {...buttonProps}>
      {children}
    </StyledButton>
  );
};
