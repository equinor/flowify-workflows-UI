import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { StyledMenuButton } from '../styles/styles';

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon: string;
  label: string;
  create?: boolean;
}

export const MenuButton: FC<MenuButtonProps> = (props: MenuButtonProps) => {
  const { label, icon, active, ...buttonProps } = props;
  return (
    <StyledMenuButton active={active || false} {...buttonProps}>
      <Icon name={icon} color={props.create ? '#00977B' : '#007079'} />
      <Typography variant="caption" style={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
    </StyledMenuButton>
  );
};
