import React from 'react';
import { AlignContentTypes, AlignItemsTypes, AlignSelfTypes, JustifyContentTypes } from '../stack/types';

export interface GridProps {
  item?: boolean;
  container?: boolean;
  alignContent?: AlignContentTypes;
  alignItems?: AlignItemsTypes;
  alignSelf?: AlignSelfTypes;
  justifyContent?: JustifyContentTypes;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  spacing?: number;
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
}

export interface IGridItem {
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
