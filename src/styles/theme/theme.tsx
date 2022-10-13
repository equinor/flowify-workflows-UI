import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

export const theme: DefaultTheme = {
  shadows: {
    elevated: '0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12)',
  },
  colors: {
    primary: {
      resting: 'rgb(0, 112, 121)',
      hover: 'rgb(0, 79, 85)',
      hover_alt: 'rgb(222, 237, 238)',
      selected_highlight: 'rgb(230, 250, 236)',
      selected_hover: 'rgb(195, 243, 210)',
    },
    backgrounds: {
      default: 'rgb(255, 255, 255)',
      light: 'rgb(247, 247, 247)',
      medium: 'rgb(220, 220, 220)',
      warning: 'rgb(255, 231, 214)',
      danger: 'rgb(255, 193, 193)',
      info: 'rgb(213, 234, 244)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      scrim: 'rgba(0, 0, 0, 0.4)',
      error: '#FFE0E7',
    },
    error: {
      resting: 'rgb(235, 0, 0)',
      hover: 'rgb(179, 13, 47)',
      highlight: 'rgb(255, 193, 193)',
      text: 'rgb(179, 13, 47)',
    },
    success: {
      resting: 'rgb(75, 183, 72)',
      hover: 'rgb(53, 129, 50)',
      highlight: 'rgb(230, 250, 236)',
      text: 'rgb(53, 129, 50)',
    },
  },
};

export const defaults = {
  borderRadius: '0.75rem',
};

export const addTheme = (children: React.ReactNode) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
