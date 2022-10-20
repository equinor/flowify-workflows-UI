import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { StyledMenuButton } from '../styles';

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon: string;
  label: string;
  create?: boolean;
  danger?: boolean;
}

export const MenuButton: FC<MenuButtonProps> = (props: MenuButtonProps) => {
  const { label, icon, active, create, danger, ...buttonProps } = props;
  const buttonTheme = active ? 'active' : create ? 'create' : danger ? 'danger' : 'default';
  return (
    <StyledMenuButton buttonTheme={buttonTheme} {...buttonProps}>
      <Icon name={icon} />
      <Typography variant="caption" style={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
    </StyledMenuButton>
  );
};
