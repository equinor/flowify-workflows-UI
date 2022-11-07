import styled from 'styled-components';

export const StyledBreadcrumbs = styled.nav`
  ol {
    list-style: none;
    display: flex;
    column-gap: 0.5rem;
    row-gap: 0.25rem;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    li {
      display: flex;
      align-items: flex-end;
      column-gap: 0.5rem;
      color: ${({ theme }) => theme?.defaults?.color};
      a {
        transition: ease-in-out all 0.3s;
        &:hover {
          text-decoration: underline;
          color: ${({ theme }) => theme?.defaults?.iconColor};
        }
      }
      span {
        font-weight: bold;
      }
    }
  }
`;
