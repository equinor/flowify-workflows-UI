import React, { FC } from 'react';
import { StyledContainer } from './styles';
import { IContainer } from './types';

const Container: FC<IContainer> = (props: IContainer) => {
  return (
    <StyledContainer dashboard={props.dashboard} withMargins={props.withMargins}>
      {props.children}
    </StyledContainer>
  );
};

Container.defaultProps = {
  withMargins: false,
  children: null,
};

export default Container;
