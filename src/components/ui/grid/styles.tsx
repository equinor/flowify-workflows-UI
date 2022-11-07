import styled, { css } from 'styled-components';
import { GridProps, IGridItem } from './types';

export const GridWrapper = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: ${(props) => props.alignItems};
  align-content: ${(props) => props.alignContent};
  align-self: ${(props) => props.alignSelf};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => `${props.spacing}rem`};
`;

export const GridItem = styled.div<IGridItem>`
  grid-column: span 1;

  ${(props) =>
    props.xs &&
    css`
      @media (min-width: 639px) {
        grid-column: span ${props.xs};
      }
    `}

  ${(props) =>
    props.s &&
    css`
      @media (min-width: 727px) {
        grid-column: span ${props.s};
      }
    `}

    ${(props) =>
    props.m &&
    css`
      @media (min-width: 939px) {
        grid-column: span ${props.m};
      }
    `}

    ${(props) =>
    props.l &&
    css`
      @media (min-width: 1279px) {
        grid-column: span ${props.l};
      }
    `}

    ${(props) =>
    props.xl &&
    css`
      @media (min-width: 1339px) {
        grid-column: span ${props.xl};
      }
    `}
`;
