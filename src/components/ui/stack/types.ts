import React from 'react';

export type AlignContentTypes =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'stretch'
  | 'initial'
  | 'inherit';
export type AlignItemsTypes = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'initial' | 'inherit';
export type AlignSelfTypes =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'stretch'
  | 'baseline'
  | 'auto'
  | 'initial'
  | 'inherit';

export type JustifyContentTypes =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'initial'
  | 'inherit';

export type DirectionTypes = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export interface StackProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  spacing?: number;
  inline?: boolean;
  alignContent?: AlignContentTypes;
  alignItems?: AlignItemsTypes;
  alignSelf?: AlignSelfTypes;
  justifyContent?: JustifyContentTypes;
  basis?: 'none' | 'auto' | 'fill' | 'content' | 'fit-content' | 'min-content' | 'max-content';
  grow?: number;
  shrink?: number;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'initial' | 'no-wrap' | 'wrap' | 'wrap-reverse';
  order?: number;
  className?: string;
  style?: React.CSSProperties;
  padding?: number;
  as?: keyof JSX.IntrinsicElements;
}

export interface StyledStackProps {
  alignItems?: AlignItemsTypes;
  alignContent?: AlignContentTypes;
  alignSelf?: AlignSelfTypes;
  justifyContent?: JustifyContentTypes;
  flexDirection?: DirectionTypes;
  flexGrow?: number;
  flexShrink?: number;
  inline?: boolean;
  padding?: number;
  spacing?: number;
  flexWrap?: 'initial' | 'no-wrap' | 'wrap' | 'wrap-reverse';
}
