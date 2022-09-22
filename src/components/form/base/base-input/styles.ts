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
  border: 1px solid #9ca6ac;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  ${(props) =>
    props.focused &&
    css`
      outline: 1px solid #007079;
      outline-offset: 0px;
    `}

  ${(props) =>
    props.positive &&
    css`
      border: 1px solid #4bb748;
      background: #e6faec;
    `}

    ${(props) =>
    props.error &&
    css`
      border: 1px solid #eb0000;
      background: #ff667019;
    `}

    ${(props) =>
    props.readOnly &&
    css`
      background: #f7f7f7;
      color: #333333;
    `}

    ${(props) =>
    props.error &&
    props.focused &&
    css`
      outline: 1px solid #b30d2f;
      outline-offset: 0px;
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
  color: #007079;
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
