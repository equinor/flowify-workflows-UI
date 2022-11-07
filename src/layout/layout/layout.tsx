import React, { FC } from 'react';
import Header from '../header/header';
import { StyledMain, StyledPageWrapper } from './styles';
import { ILayout } from './types';

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
