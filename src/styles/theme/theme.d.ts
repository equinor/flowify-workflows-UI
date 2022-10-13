import 'styled-components';

interface InputTheme {
  default: string;
  focused: string;
  positive: string;
  error: string;
  readOnly: string;
}

interface ButtonThemes {
  simple: string;
  create: string;
  danger: string;
  default: string;
}

interface EditorMenuButtonThemes {
  default: string;
  active: string;
  danger: string;
  create: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    defaults: {
      borderRadius: string;
      focusOutline: string;
      color: string;
      iconColor: string;
    };
    layout: {
      background: string;
    };
    paper: {
      background: string;
      boxShadow: string;
      borderColor: string;
    };
    box: {
      background: string;
      border: string;
      hover: {
        background: string;
      };
    };
    button: {
      background: ButtonThemes;
      color: ButtonThemes;
      hover: {
        background: ButtonThemes;
        color: ButtonThemes;
      };
    };
    multiToggle: {
      background: string;
      button: {
        color: string;
        background: string;
      };
    };
    input: {
      background: InputTheme;
      border: InputTheme;
      color: {
        default: string;
        readOnly: string;
        enhancer: string;
      };
      focusedOutline: string;
    };
    editorMenu: {
      background: string;
      button: {
        background: EditorMenuButtonThemes;
        icon: EditorMenuButtonThemes;
        hover: {
          background: EditorMenuButtonThemes;
        };
      };
    };
  }
}
