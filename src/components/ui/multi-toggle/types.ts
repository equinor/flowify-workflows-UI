import { TypographyVariants } from '@equinor/eds-core-react/dist/types/components/Typography/Typography.tokens';
import React from 'react';

export interface MultiToggleProps {
  children: Array<React.ReactNode>;
  label?: string;
  'aria-label'?: string;
  id?: string;
  labelVariant?: TypographyVariants;
  style?: React.CSSProperties;
}

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}
