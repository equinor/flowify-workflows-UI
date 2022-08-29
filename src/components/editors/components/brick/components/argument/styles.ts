import styled from 'styled-components';

const ArgumentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  align-items: center;
  padding: 0rem 1rem;
  flex-grow: 2;
`;

const ArgumentButton = styled.button`
  background-color: #ade2e619;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  column-gap: 1rem;
  flex-grow: 2;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #deedee;
  }
`;

export { ArgumentButton, ArgumentWrapper };
