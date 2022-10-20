import React from 'react';

export type ChipTheme = 'default' | 'success' | 'error';

export interface ChipProps {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  theme?: ChipTheme;
}
