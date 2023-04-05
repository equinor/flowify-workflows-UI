import styled from 'styled-components';
import { Stack } from '..';

export const StyledJsonWrapper = styled(Stack)`
  background-color: ${({ theme }) => theme?.layout?.background};
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
  .react-json-view {
    .object-meta-data {
      .object-size {
        color: ${({ theme }) => theme?.defaults?.color} !important;
        opacity: 0.5;
      }
    }
  
    span {
      color: ${({ theme }) => theme?.defaults?.color} !important;
    }
  }
`;
