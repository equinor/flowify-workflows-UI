import styled from 'styled-components';
import { Breadcrumbs as UIBreadcrumbs } from '@equinor/eds-core-react';

export const Breadcrumbs = styled(UIBreadcrumbs)`
  a {
    &:hover {
      color: ${(props) => props.theme.colors.primary.resting};
      text-decoration: underline;
    }
  }
`;
