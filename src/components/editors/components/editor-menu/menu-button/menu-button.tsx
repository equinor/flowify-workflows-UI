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
  const { label, icon, active, ...buttonProps } = props;
  return (
    <StyledMenuButton active={active || false} {...buttonProps}>
      <Icon name={icon} color={props.create ? '#00977B' : props.danger ? '#B30D2F' : '#007079'} />
      <Typography variant="caption" style={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
    </StyledMenuButton>
  );
};
