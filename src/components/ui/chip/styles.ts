import styled, { css } from 'styled-components';
import { ChipTheme } from './types';

export const StyledChip = styled.span<{ button?: boolean; chipTheme: ChipTheme }>`
  background: ${(props) => props?.theme?.chip?.background?.[props?.chipTheme]};
  color: ${({ theme }) => theme?.defaults?.color};
  padding: 0.25rem 0.5rem;
  border: ${(props) => props?.theme?.chip?.border?.[props?.chipTheme]};
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
  font-size: 1rem;
  ${(props) =>
    props.button &&
    css`
      cursor: pointer;
      display: flex;
      align-items: center;
      column-gap: 0.5rem;
      &:hover {
        border: ${props?.theme?.chip?.hover?.border?.[props?.chipTheme]};
      }
    `}
`;
