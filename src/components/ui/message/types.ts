import React from 'react';
import { ICONS } from '../../../common/icons';

export type MessageTheme = 'warning' | 'error' | 'success' | 'default';

export interface MessageProps {
  icon?: keyof typeof ICONS;
  children?: React.ReactNode;
  theme?: MessageTheme;
  style?: React.CSSProperties;
}
