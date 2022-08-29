import styled from 'styled-components';

export const ParameterWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  column-gap: 1rem;
  padding: 0.75rem;
  background-color: #ade2e619;
  border: none;
  //border-left: 3px solid #007079;
  border-radius: 1rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 112, 121, 0.2);
  }
`;
