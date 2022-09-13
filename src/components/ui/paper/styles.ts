import styled from 'styled-components';
import { Stack } from '../stack/stack';

export type PaperTheme = 'paper' | 'light';

export const StyledPaper = styled(Stack)<{ theme?: PaperTheme }>`
  border-radius: 1rem;
  ${(props) =>
    props.theme === 'paper' &&
    `
    background: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12);
    border-top: 1px solid rgb(247, 247, 247);
  `}
  ${(props) =>
    props.theme === 'light' &&
    `
    background: #ADE2E619;
    border-radius: 10px;
    border-bottom: 1px solid #97CACE;
    border-right: 1px solid #97CACE;
  `}
`;
