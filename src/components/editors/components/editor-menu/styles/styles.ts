import styled from 'styled-components';

export const StyledMenuButton = styled.button<{ active: boolean; create?: boolean }>`
  border: none;
  padding: 0.75rem;
  background: ${(props) => (props.active ? 'rgb(222, 237, 238)' : 'none')};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.create ? '#E6FAEC' : 'rgb(222, 237, 238)')};
  }
`;
