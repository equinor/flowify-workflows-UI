import React from 'react';
import { ICONS } from '@common';

export type ButtonTheme = 'default' | 'simple' | 'create' | 'danger' | 'link' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  theme?: ButtonTheme;
  href?: string;
  rel?: string;
  as?: keyof JSX.IntrinsicElements;
  target?: string;
  leftIcon?: keyof typeof ICONS;
  rightIcon?: keyof typeof ICONS;
  icon?: keyof typeof ICONS;
  loading?: boolean;
}
