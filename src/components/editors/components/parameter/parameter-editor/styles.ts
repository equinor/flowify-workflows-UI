import styled from 'styled-components';
import { Stack } from '../../../../ui';

export const StyledParameterWrapper = styled(Stack)`
  background: ${({ theme }) => theme?.layout?.background};
  h5,
  p {
    color: ${({ theme }) => theme?.defaults?.color};
  }
`;
