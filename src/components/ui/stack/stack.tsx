import React, { FC } from 'react';
import { StyledStack } from './styles';
import { StackProps } from './types';

export const Stack: FC<StackProps> = (props: StackProps) => {
  const { basis, grow, shrink, direction, wrap, order, ...restProps } = props;
  return <StyledStack flexDirection={direction} flexGrow={grow} flexShrink={shrink} flexWrap={wrap} {...restProps} />;
};

Stack.defaultProps = {
  direction: 'column',
  alignContent: 'initial',
  alignItems: 'initial',
  alignSelf: 'initial',
  justifyContent: 'initial',
  wrap: 'initial',
  padding: 0,
  grow: 0,
  shrink: 1,
};
