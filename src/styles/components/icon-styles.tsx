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

interface IProgressIcons {
  error?: boolean;
}

export const ProgressIcons = styled.div<IProgressIcons>`
  height: 1.25rem;
  width: 1.25rem;
  background-color: ${(props) => (props.error ? props.theme.colors.error.resting : props.theme.colors.success.resting)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 1rem;
    width: 1rem;
    fill: white;
  }
`;
