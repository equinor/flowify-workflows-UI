import styled from 'styled-components';
import { Icon } from '@equinor/eds-core-react';

export const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  .ff-header__link {
    padding: 0.75rem;
    &:hover {
      background-color: ${(props) => props.theme.colors.primary.hover_alt};
      border-radius: 50%;
    }
  }
`;

export const FlowifyIcon = styled(Icon)`
  fill: ${(props) => props.theme?.colors?.primary.resting};
`;
