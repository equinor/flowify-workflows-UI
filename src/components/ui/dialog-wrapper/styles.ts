import styled from 'styled-components';
import { Stack } from '..';

export const StyledDialogWrapper = styled(Stack)`
  background-color: ${({ theme }) => theme?.layout?.background};
  h4,
  h5,
  h6,
  label,
  span,
  td,
  th,
  p {
    color: ${({ theme }) => theme?.defaults?.color};
  }
  svg {
    fill: ${({ theme }) => theme?.defaults?.iconColor};
  }
`;
