import styled from 'styled-components';
import { ButtonTheme } from './types';

export const StyledButton = styled.button<{ buttonTheme: ButtonTheme }>`
  appearance: none;
  border: none;
  outline: none;
  padding: ${(props) => (props.buttonTheme === 'link' ? '0' : props.buttonTheme === 'icon' ? '0.5rem' : '1rem')};
  background-color: ${(props) => props?.theme?.button?.background?.[props.buttonTheme]};
  color: ${(props) => props?.theme?.button?.color?.[props.buttonTheme]};
  border-radius: ${(props) => (props?.buttonTheme === 'icon' ? '50%' : props?.theme?.defaults?.borderRadius)};
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 1rem;
  max-width: max-content;
  min-width: min-content;
  font-weight: ${(props) => (props.buttonTheme === 'link' ? 'inherit' : '500')};
  cursor: pointer;
  transition: ease-in-out background-color 0.2s;
  svg {
    fill: ${(props) => props?.theme?.button?.color?.[props.buttonTheme]};
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${(props) => props?.theme?.button?.hover?.background?.[props.buttonTheme]};
    color: ${(props) => props?.theme?.button?.hover?.color?.[props.buttonTheme]};
    text-decoration: ${(props) => (props.buttonTheme === 'link' ? 'underline' : 'none')};
  }

  &:focus {
    outline: ${(props) => props?.theme?.defaults?.focusOutline};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
