import styled from 'styled-components';
import { IContainer } from './types';

export const StyledContainer = styled.div<IContainer>`
  width: 100%;
  max-width: 100%;
  padding: ${(props) => (props.withMargins ? '1rem 3rem 3rem' : '0')};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
