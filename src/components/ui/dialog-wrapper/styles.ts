import styled from 'styled-components';
import { Stack } from '..';

export const StyledDialogWrapper = styled(Stack)`
  background-color: ${({ theme }) => theme?.layout?.background};
  height: 100%;
  color: ${({ theme }) => theme?.defaults?.color};
  h4,
  h5,
  h6,
  label,
  span,
  td,
  th,
  code,
  p {
    color: ${({ theme }) => theme?.defaults?.color};
  }
  svg {
    fill: ${({ theme }) => theme?.defaults?.iconColor};
  }
`;
