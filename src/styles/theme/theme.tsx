import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

export const theme: DefaultTheme = {
  shadows: {
    elevated: '0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12)',
  },
  colors: {
    themes: {
      flowify: 'linear-gradient(180deg, #007079 0%, #97CACE 100%)',
      teal: 'linear-gradient(135deg, #E6FAEE 30.21%, #97CACE 100%)',
      red: 'linear-gradient(135deg, #FFE7D6 30.21%, #FFC1C1 100%)',
      orange: 'linear-gradient(135deg, #FFECD2 30.21%, #FFC67A 100%)',
      blue: 'linear-gradient(135deg, #D5EAF4 30.21%, #0084C4 100%)',
      green: 'linear-gradient(135deg, #C1E7C1 30.21%, #4BB748 100%)',
      pink: 'linear-gradient(135deg, #FFCDD7 30.21%, #FF7D98 100%)',
    },
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

export const addTheme = (children: React.ReactNode) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
