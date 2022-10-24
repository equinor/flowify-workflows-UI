import styled from 'styled-components';

const StyledTextButton = styled.button`
  background: none;
  border: none;
  cursor: text;
  padding: 0;
  border-radius: ${({ theme }) => theme.defaults.borderRadius};
  &:focus {
    outline: ${({ theme }) => theme.defaults.focusOutline};
    outline-offset: 2px;
  }
`;

export { StyledTextButton };
