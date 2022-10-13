import { DefaultTheme } from 'styled-components';
import { defaults } from './theme';

const defaultTextColor = '#ffffff';
const defaultIconColor = '#97CACE';

export const darkTheme: DefaultTheme = {
  defaults: {
    ...defaults,
    focusOutline: '3px dotted #007079',
    color: defaultTextColor,
    iconColor: defaultIconColor,
  },
  layout: {
    background: '#132634',
  },
  paper: {
    background: '#2E3F4D',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12)',
    borderColor: 'transparent',
  },
  box: {
    background: 'rgba(173, 226, 230, 0.1)',
    border: '1px solid transparent',
    hover: {
      background: 'rgba(161, 218, 160, 0.2)',
    },
  },
  button: {
    background: {
      simple: 'transparent',
      create: '#A1DAA019',
      danger: '#FFC1C1',
      default: '#DEEDEE',
    },
    color: {
      simple: '#ffffff',
      create: '#ffffff',
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
        simple: 'rgba(61,61,61,1)',
        create: '#004F55',
        danger: 'white',
        default: '#18252f',
      },
    },
  },
  multiToggle: {
    background: '#ADE2E619',
    button: {
      color: '#ffffff',
      background: 'rgba(161, 218, 160, 0.2)',
    },
  },
  input: {
    background: {
      default: '#ADE2E619',
      focused: '#ADE2E619',
      positive: '#e6faec',
      error: '#ff667019',
      readOnly: '#f7f7f7',
    },
    border: {
      default: '1px solid #ADE2E619',
      focused: '1px solid #ADE2E619',
      positive: '1px solid #4bb748',
      error: '1px solid #eb0000',
      readOnly: '1px solid #9ca6ac',
    },
    color: {
      default: defaultTextColor,
      readOnly: '#333333',
      enhancer: '#007079',
    },
    focusedOutline: '1px solid #C3F3D2',
    selectItemHover: 'rgba(161, 218, 160, 0.2)',
  },
  editorMenu: {
    background: '#2E3F4D',
    button: {
      background: {
        default: 'none',
        active: '#ADE2E619',
        danger: '#FF667019',
        create: 'none',
      },
      icon: {
        default: defaultIconColor,
        active: defaultIconColor,
        create: '#C3F3D2',
        danger: '#B30D2F',
      },
      hover: {
        background: {
          default: '#ADE2E619',
          active: '#ADE2E619',
          danger: 'rgba(255, 102, 112, 0.3)',
          create: '#A1DAA019',
        },
      },
    },
  },
};
