import React, { FC } from 'react';
import styled from 'styled-components';
import Header from './components/header';

interface ILayout {
  classes?: string;
  children?: React.ReactNode;
  dashboard?: boolean;
}

const StyledPageWrapper = styled.div<ILayout>`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-height: ${(props) => (props.dashboard ? '100vh' : 'none')};
`;

const StyledMain = styled.main<ILayout>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Layout: FC<ILayout> = (props: ILayout) => {
  const { dashboard } = props;
  return (
    <StyledPageWrapper dashboard={dashboard}>
      <Header />
      <StyledMain dashboard={dashboard} className={props.classes}>
        {props.children}
      </StyledMain>
    </StyledPageWrapper>
  );
};

export default Layout;
