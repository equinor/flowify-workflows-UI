import React, { FC } from 'react';
import { GridItem, GridWrapper } from './styles';
import { GridProps } from './types';

export const Grid: FC<GridProps> = (props: GridProps) => {
  const { item, container, ...restProps } = props;
  if (container) {
    return <GridWrapper {...restProps} />;
  }
  if (item) {
    return <GridItem {...restProps} />;
  }
  return null;
};

Grid.defaultProps = {
  alignContent: 'initial',
  alignItems: 'initial',
  alignSelf: 'initial',
  justifyContent: 'initial',
};
