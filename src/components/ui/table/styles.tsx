import styled from 'styled-components';

export const StyledTable = styled.table`
  thead {
    text-align: left;
    th {
      padding: 0.5rem;
      border-bottom: 1px solid ${({ theme }) => theme?.box?.background};
    }
  }
  tbody {
    td {
      padding: 0.5rem;
    }
  }
`;
