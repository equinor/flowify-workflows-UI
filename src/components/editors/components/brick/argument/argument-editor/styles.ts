import styled from 'styled-components';
import { Stack } from '../../../../../ui';

export const EditorWrapper = styled(Stack)`
  background-color: ${({ theme }) => theme?.layout?.background};
  h5,
  p {
    color: ${({ theme }) => theme?.defaults?.color};
  }
`;
