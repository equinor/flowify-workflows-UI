import styled, { css } from 'styled-components';
import { Stack } from '../stack/stack';

export type PaperTheme = 'paper' | 'light';

export const StyledPaper = styled(Stack)<{ paperTheme?: PaperTheme }>`
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
  ${(props) =>
    props.paperTheme === 'paper' &&
    css`
      background: ${props?.theme?.paper?.background};
      box-shadow: ${props?.theme?.paper?.boxShadow};
      border-top: 1px solid ${props?.theme?.paper?.borderColor};
    `}
  ${(props) =>
    props.paperTheme === 'light' &&
    css`
      background: ${props?.theme?.box?.background};
      border-bottom: ${props?.theme?.box?.border};
      border-right: ${props?.theme?.box?.border};
    `}
`;
