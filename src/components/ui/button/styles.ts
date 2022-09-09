import styled from 'styled-components';
import { ButtonTheme } from './types';

export const StyledButton = styled.button<{ theme: ButtonTheme }>`
  appearance: none;
  border: none;
  padding: ${(props) => (props.theme === 'simple' ? '0' : '1rem')};
  background-color: ${(props) =>
    props.theme === 'simple'
      ? 'transparent'
      : props.theme === 'create'
      ? '#E6FAEC'
      : props.theme === 'danger'
      ? '#FFC1C1'
      : '#ADE2E619'};
  color: #18252f;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 1rem;
  font-weight: ${(props) => (props.theme === 'simple' ? 'inherit' : '500')};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.theme === 'simple' ? 'transparent' : 'white')};
    text-decoration: ${(props) => (props.theme === 'simple' ? 'underline' : 'none')};
  }
`;
