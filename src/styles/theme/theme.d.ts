import 'styled-components';

interface ThemeColor {
  resting: string;
  hover: string;
  hover_alt: string;
  selected_highlight: string;
  selected_hover: string;
}

interface SemanticColor {
  resting: string;
  hover: string;
  highlight: string;
  text: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    shadows: {
      elevated: string;
    };
    colors: {
      themes: {
        flowify: string;
        teal: string;
        red: string;
        orange: string;
        blue: string;
        green: string;
        pink: string;
      };
      backgrounds: {
        default: string;
        light: string;
        medium: string;
        warning: string;
        danger: string;
        info: string;
        overlay: string;
        scrim: string;
        error: string;
      };
      primary: ThemeColor;
      error: SemanticColor;
      success: SemanticColor;
    };
  }
}
