import styled from 'styled-components';

const StyledMultiToggle = styled.div`
  background-color: #deedee;
  border-radius: 50px;
  display: flex;
  row-gap: 1rem;
  max-width: max-content;
  padding: 0.25rem;
`;

const StyledToggleButton = styled.button<{ active?: boolean }>`
  background: ${(props) => (props.active ? '#97CACE' : 'none')};
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  &:focus {
    outline: 3px dotted #007079;
    outline-offset: 3px;
  }
`;

export { StyledMultiToggle, StyledToggleButton };
