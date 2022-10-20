import styled from 'styled-components';

export const ParameterWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  column-gap: 1rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.box.background};
  border: none;
  border-bottom: ${({ theme }) => theme.box.border};
  border-right: ${({ theme }) => theme.box.border};
  border-radius: ${({ theme }) => theme.defaults.borderRadius};
  h5,
  p {
    color: ${({ theme }) => theme.defaults.color};
  }
  svg {
    fill: ${({ theme }) => theme.defaults.iconColor};
  }
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.box.hover.background};
  }
  &:focus {
    outline: ${({ theme }) => theme.defaults.focusOutline};
  }
`;
