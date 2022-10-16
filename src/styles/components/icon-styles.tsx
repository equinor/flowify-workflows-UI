import styled from 'styled-components';
import { Icon } from '@equinor/eds-core-react';

export const FlowifyIcon = styled(Icon)`
  fill: ${(props) => props.theme?.colors?.primary.resting};
`;
