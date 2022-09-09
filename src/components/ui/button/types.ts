import React from 'react';

export type ButtonTheme = 'default' | 'simple' | 'create' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  theme?: ButtonTheme;
  href?: string;
  rel?: string;
  as?: keyof JSX.IntrinsicElements;
  target?: string;
}
