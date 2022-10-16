import styled from 'styled-components';
import { Stack } from '..';

export const StyledDialogWrapper = styled(Stack)`
  background-color: ${({ theme }) => theme?.layout?.background};
  h4,
  h5,
  p {
    color: ${({ theme }) => theme?.defaults?.color};
  }
`;
