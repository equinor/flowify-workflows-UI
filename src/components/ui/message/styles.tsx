import styled from 'styled-components';
import { Stack } from '../stack/stack';
import { MessageTheme } from './types';

export const StyledMessage = styled(Stack)<{ messageTheme: MessageTheme }>`
  background-color: ${(props) => props?.theme?.message?.background?.[props.messageTheme]};
  svg {
    fill: ${(props) => props?.theme?.message?.icon?.[props.messageTheme]}!important;
  }
`;
