import styled, { css } from 'styled-components';

interface InputWrapperProps {
  focused?: boolean;
  positive?: boolean;
  error?: boolean;
  readOnly?: boolean;
}

export const StyledInputWrapper = styled.div<InputWrapperProps>`
  position: relative;
  display: flex;
  justify-content: space-between;
  border: ${({ theme }) => theme?.input?.border?.default};
  border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
  padding: 0.5rem;
  background: ${({ theme }) => theme?.input?.background?.default};
  color: ${({ theme }) => theme?.input?.color?.default};
  ${(props) =>
    props.focused &&
    css`
      outline: ${props?.error ? '1px solid #eb0000' : props?.theme?.input?.focusedOutline};
    `}

  ${(props) =>
    props.positive &&
    css`
      border: ${({ theme }) => theme?.input?.border?.positive};
      background: #${({ theme }) => theme?.input?.background?.positive};
    `}

    ${(props) =>
    props.error &&
    css`
      border: ${({ theme }) => theme?.input?.border?.error};
      background: ${({ theme }) => theme?.input?.background?.error};
    `}

    ${(props) =>
    props.readOnly &&
    css`
      background: ${({ theme }) => theme?.input?.background?.default};
      color: ${({ theme }) => theme?.input?.color?.readOnly};
    `}

    input, textarea, select {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    font-size: 1rem;
    font-family: inherit;
    background: none;
    border-radius: 0.5rem;
    outline: none;
    position: relative;
    z-index: 2;
    border: none;
    color: inherit;
    &:focus {
      outline: none;
    }
    &:read-only {
      background: none;
    }
  }

  input,
  textarea {
    padding: 0.5rem 0.75rem;
  }

  textarea {
    resize: vertical;
  }

  select {
    padding: 0.5rem 3rem 0.5rem 0.75rem;
    width: 100%;
  }
`;

export const EnhancerWrapper = styled.div<{ type: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme?.input?.color?.readOnly};
  padding: ${(props) => (props.type === 'start' ? '0 0 0 1rem' : '0 1rem 0 0.5rem')};
`;

export const ClearIconWrapper = styled.div`
  z-index: 2;
  padding-right: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0 !important;
`;

export const ToggleMaskButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  svg {
    fill: #6f6f6f;
  }
`;
