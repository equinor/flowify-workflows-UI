import styled, { css } from 'styled-components';

export const SelectWrapper = styled.div`
  position: relative;
`;

export const SelectButton = styled.button<{ readOnly?: boolean }>`
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  padding: 0.85rem 0.5rem 0.85rem 1rem;
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
  font-size: inherit;
  font-family: inherit;
  background: ${({ theme }) => theme?.input?.background?.default};
  border: ${({ theme }) => theme?.input?.border?.default};
  color: ${({ theme }) => theme?.input?.color?.default};
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
  cursor: pointer;
  position: relative;

  ${(props) =>
    props.readOnly &&
    css`
      background: ${({ theme }) => theme?.input?.background?.readOnly};
      color: ${({ theme }) => theme?.input?.color?.readOnly};
    `}

  &:focus {
    outline: ${({ theme }) => theme?.input?.focusedOutline};
  }
`;

export const OptionsWrapper = styled.ul`
  position: absolute;
  padding-inline-start: 0px;
  margin-block-start: 0;
  background: ${({ theme }) => theme?.layout?.background};
  overflow-y: scroll;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 3;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
`;

export const Option = styled.li<{ highlighted: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(props) =>
    props?.highlighted ? props?.theme?.input?.selectItemHover : props?.theme?.input?.background?.default};
  color: ${({ theme }) => theme?.defaults?.color};
  cursor: pointer;
  svg {
    fill: ${({ theme }) => theme?.defaults?.iconColor};
  }
  &:hover {
    background: ${({ theme }) => theme?.input?.selectItemHover};
  }
`;
