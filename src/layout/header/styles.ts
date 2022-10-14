import styled from 'styled-components';

export const TopBar = styled.div`
  padding: 0.25rem 2rem;
  background: ${({ theme }) => theme?.layout?.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    color: ${({ theme }) => theme?.defaults?.color};
  }
`;
