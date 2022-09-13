import styled from 'styled-components';
import { StyledStackProps } from './types';

export const StyledStack = styled.div<StyledStackProps>`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  align-content: ${(props) => props.alignContent};
  align-self: ${(props) => props.alignSelf};
  justify-content: ${(props) => props.justifyContent};
  padding: ${(props) => (props.padding ? `${props.padding}rem` : 0)};
  flex-grow: ${(props) => props.flexGrow};
  flex-shrink: ${(props) => props.flexShrink};
  ${(props) =>
    props.spacing &&
    `
    ${
      props.flexDirection === 'column' || props.flexDirection === 'column-reverse'
        ? `
        & > * {
            margin-top: ${props.spacing}rem;
        }
        & > *:first-child {
            margin-top: 0;
        }
    `
        : ''
    }
    ${
      props.flexDirection === 'row' || props.flexDirection === 'row-reverse'
        ? `
        & > * {
            margin-right: ${props.spacing}rem;
            &:last-child {
                margin-right: 0;
            }
        }
    `
        : ''
    }
  `}
`;
