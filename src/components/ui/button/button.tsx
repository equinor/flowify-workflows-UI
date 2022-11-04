import { Icon } from '@equinor/eds-core-react';
import React, { FC } from 'react';
import { StyledButton } from './styles';
import { ButtonProps } from './types';

export const Button: FC<ButtonProps> = React.forwardRef((props: ButtonProps, ref) => {
  const { children, theme, as, icon, leftIcon, rightIcon, loading, ...buttonProps } = props;

  return (
    <StyledButton
      as={as || (buttonProps?.href ? 'a' : 'button')}
      buttonTheme={theme!}
      type="button"
      {...buttonProps}
      // @ts-ignore
      ref={ref}
    >
      {loading && <Icon name="loop" className="rotate" />}
      {leftIcon && <Icon name={leftIcon} />}
      {icon && <Icon name={icon} />}
      {children && children}
      {rightIcon && <Icon name={rightIcon} />}
    </StyledButton>
  );
});

Button.defaultProps = {
  theme: 'default',
};

export type { ButtonProps };
