import styled from 'styled-components';
import { ILayout } from './types';

export const StyledPageWrapper = styled.div<ILayout>`
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

export const StyledMain = styled.main<ILayout>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
