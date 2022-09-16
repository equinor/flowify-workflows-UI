import styled from 'styled-components';
import { ButtonTheme } from './types';

export const StyledButton = styled.button<{ theme: ButtonTheme }>`
  appearance: none;
  border: none;
  outline: none;
  padding: ${(props) => (props.theme === 'simple' ? '0' : '1rem')};
  background-color: ${(props) =>
    props.theme === 'simple'
      ? 'transparent'
      : props.theme === 'create'
      ? '#E6FAEC'
      : props.theme === 'danger'
      ? '#FFC1C1'
      : '#DEEDEE'};
  color: #18252f;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 1rem;
  font-weight: ${(props) => (props.theme === 'simple' ? 'inherit' : '500')};
  cursor: pointer;
  transition: ease-in-out all 0.2s;

  &:hover {
    background-color: ${(props) => (props.theme === 'simple' ? 'transparent' : '#C3F3D2')};
    background-color: ${(props) =>
      props.theme === 'simple'
        ? 'transparent'
        : props.theme === 'create'
        ? '#C3F3D2'
        : props.theme === 'danger'
        ? '#FF6670'
        : '#C9E0E2'};
    color: ${(props) => (props.theme === 'danger' ? 'white' : 'black')};
    text-decoration: ${(props) => (props.theme === 'simple' ? 'underline' : 'none')};
  }

  &:focus {
    outline: 3px dotted #007079;
    outline-offset: 3px;
  }
`;
