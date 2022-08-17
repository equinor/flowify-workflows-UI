import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';

export const StyledCard = styled.div`
  display: flex;
  column-gap: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 1rem;
  border-left: 3px solid ${(props) => props.theme.colors.primary.resting};
  button {
    flex-shrink: 0;
  }
`;

export const Card = (props: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <StyledCard>{props.children}</StyledCard>
  </ThemeProvider>
);

export const StyledManifestWrapper = styled.div<{ error?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-top: 0.5rem;
  position: relative;
  height: 100%;
  ${(props) =>
    props.error &&
    `
  border: '1px',
  borderStyle: 'solid',
  borderColor: red;
`}
`;
