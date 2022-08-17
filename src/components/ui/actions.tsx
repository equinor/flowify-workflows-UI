import styled from 'styled-components';

export const ButtonLink = styled.div<{ simple?: boolean; create?: boolean }>`
  appearance: none;
  border: none;
  padding: ${(props) => (props.simple ? '0' : '1rem')};
  background-color: ${(props) => (props.simple ? 'transparent' : props.create ? '#A1DAA019' : '#ADE2E619')};
  color: #18252f;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 1rem;
  font-weight: ${(props) => (props.simple ? 'inherit' : '500')};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.simple ? 'transparent' : 'white')};
    text-decoration: ${(props) => (props.simple ? 'underline' : 'none')};
  }
`;
