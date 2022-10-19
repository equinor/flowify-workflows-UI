import styled from 'styled-components';

const StyledMultiToggle = styled.div`
  background-color: ${({ theme }) => theme?.multiToggle?.background};
  border-radius: 50px;
  display: flex;
  row-gap: 1rem;
  max-width: max-content;
  padding: 0.25rem;
`;

const StyledToggleButton = styled.button<{ active?: boolean }>`
  background: ${(props) => (props.active ? props?.theme?.multiToggle?.button?.background : 'none')};
  color: ${({ theme }) => theme?.multiToggle?.button?.color};
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  font-size: inherit;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  cursor: pointer;
  &:focus {
    outline: ${({ theme }) => theme?.defaults?.focusOutline};
    outline-offset: 3px;
  }
`;

export { StyledMultiToggle, StyledToggleButton };
