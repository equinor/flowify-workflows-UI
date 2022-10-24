import React, { FC } from 'react';
import styled from 'styled-components';
import Header from './header/header';

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
  background: ${({ theme }) => theme?.layout?.background};
  color: ${({ theme }) => theme.defaults.color};
  svg {
    fill: ${({ theme }) => theme.defaults.iconColor};
  }
  h6,
  h5,
  h4,
  h3,
  h2,
  h1,
  li,
  td,
  th,
  p {
    color: ${({ theme }) => theme.defaults.color};
  }
  a {
    border-radius: ${({ theme }) => theme.defaults.borderRadius};
    &:focus {
      outline: ${({ theme }) => theme.defaults.focusOutline};
      outline-offset: 3px;
    }
  }
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
