import { DefaultTheme } from 'styled-components';
import { defaults } from './theme';

const defaultTextColor = 'rgba(61,61,61,1)';

export const lightTheme: DefaultTheme = {
  defaults: {
    ...defaults,
    focusOutline: '3px dotted #007079',
    color: defaultTextColor,
  },
  layout: {
    background: 'white',
  },
  paper: {
    background: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12)',
    borderColor: 'rgb(247, 247, 247)',
  },
  box: {
    background: '#ADE2E619',
    border: '1px solid #97CACE',
    hover: {
      background: 'rgba(0, 112, 121, 0.2)',
    },
  },
  button: {
    background: {
      simple: 'transparent',
      create: '#E6FAEC',
      danger: '#FFC1C1',
      default: '#DEEDEE',
    },
    color: {
      simple: defaultTextColor,
      create: '#004F55',
      danger: defaultTextColor,
      default: '#18252f',
    },
    hover: {
      background: {
        simple: 'transparent',
        create: '#C3F3D2',
        danger: '#FF6670',
        default: '#C9E0E2',
      },
      color: {
        simple: '#ffffff',
        create: '#004F55',
        danger: 'white',
        default: '#18252f',
      },
    },
  },
  multiToggle: {
    background: '#deedee',
    button: {
      color: defaultTextColor,
      background: '#97CACE',
    },
  },
  input: {
    background: {
      default: 'white',
      focused: 'white',
      positive: '#e6faec',
      error: '#ff667019',
      readOnly: '#f7f7f7',
    },
    border: {
      default: '1px solid #9ca6ac',
      focused: '1px solid #9ca6ac',
      positive: '1px solid #4bb748',
      error: '1px solid #eb0000',
      readOnly: '1px solid #9ca6ac',
    },
    color: {
      default: defaultTextColor,
      readOnly: '#333333',
      enhancer: '#007079',
    },
    focusedOutline: '1px solid #007079',
    selectItemHover: 'rgba(161, 218, 160, 0.2)',
  },
  editorMenu: {
    background: '#ADE2E619',
    button: {
      background: {
        default: 'none',
        active: 'rgb(222, 237, 238)',
        danger: '#FF667019',
        create: '#E6FAEC',
      },
      icon: {
        default: '#007079',
        active: defaultTextColor,
        create: '#00977B',
        danger: '#B30D2F',
      },
      hover: {
        background: {
          default: 'rgb(222, 237, 238)',
          active: 'rgb(222, 237, 238)',
          danger: '#FFC1C1',
          create: '#E6FAEC',
        },
      },
    },
  },
};
