import styled, { css } from 'styled-components';

export const StyledManifestWrapper = styled.div<{ error?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-top: 0.5rem;
  position: relative;
  height: 100%;
  ${(props) =>
    props.error &&
    css`
      border: 1px,
      border-style: solid,
      border-color: red;
  `}
`;
