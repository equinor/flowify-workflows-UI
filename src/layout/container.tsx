import React, { FC } from 'react';
import styled from 'styled-components';

interface IContainer {
  children?: React.ReactNode;
  withMargins?: boolean;
  dashboard?: boolean;
}

const StyledContainer = styled.div<IContainer>`
  width: 100%;
  max-width: 100%;
  padding: ${(props) => (props.withMargins ? '3rem 5rem' : '0')};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

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
