import styled, { css } from 'styled-components';
import { Stack } from '../stack/stack';

export type PaperTheme = 'paper' | 'light';

export const StyledPaper = styled(Stack)<{ paperTheme?: PaperTheme; hoverable?: boolean }>`
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
  ${(props) =>
    props.paperTheme === 'paper' &&
    css`
      background: ${props?.theme?.paper?.background};
      box-shadow: ${props?.theme?.paper?.boxShadow};
      border: 1px solid ${props?.theme?.paper?.borderColor};
      transition: background-color ease-in-out 0.3s;
      ${props?.hoverable &&
      css`
        &:hover {
          background: ${props?.theme?.paper?.hover?.background};
        }
      `}
    `}
  ${(props) =>
    props.paperTheme === 'light' &&
    css`
      background: ${props?.theme?.box?.background};
      border-bottom: ${props?.theme?.box?.border};
      border-right: ${props?.theme?.box?.border};
      transition: background-color ease-in-out 0.3s;
      ${props?.hoverable &&
      css`
        &:hover {
          background: ${props?.theme?.box?.hover?.background};
        }
      `}
    `}
`;
