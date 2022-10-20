import styled from 'styled-components';
import { Stack } from '../../../ui';
import { ButtonTheme } from './types';

export const StyledMenuButton = styled.button<{ buttonTheme: ButtonTheme }>`
  border: none;
  padding: 0.75rem;
  background: ${(props) => props.theme?.editorMenu?.button?.background?.[props.buttonTheme]};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  svg {
    fill: ${(props) => props.theme?.editorMenu?.button?.icon?.[props.buttonTheme]};
  }
  p {
    color: ${({ theme }) => theme?.defaults?.color} !important;
  }

  &:hover {
    background: ${(props) => props.theme?.editorMenu?.button?.hover?.background?.[props.buttonTheme]};
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  &:focus {
    outline: ${({ theme }) => theme?.defaults?.focusOutline};
  }
`;

export const StyledEditorMenu = styled(Stack)`
  background-color: ${({ theme }) => theme?.editorMenu?.background};
  padding: 0.25rem;
`;
