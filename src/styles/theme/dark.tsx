import { DefaultTheme } from 'styled-components';
import { defaults } from './theme';

const defaultTextColor = '#ffffff';
const defaultIconColor = '#97CACE';

export const darkTheme: DefaultTheme = {
  defaults: {
    ...defaults,
    focusOutline: '3px dotted #C3F3D2',
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
    hover: {
      background: 'rgba(173, 226, 230, 0.1)',
    },
  },
  box: {
    background: 'rgba(173, 226, 230, 0.1)',
    border: '1px solid transparent',
    hover: {
      background: 'rgba(161, 218, 160, 0.2)',
    },
  },
  graph: {
    background: 'rgba(0, 0, 0, 0.2)',
    nodes: {
      background: '#2E3F4D',
      hover: {
        background: '#3E4F5C',
      },
    },
    handle: {
      background: defaultIconColor,
    },
  },
  button: {
    background: {
      simple: 'transparent',
      create: 'rgba(161, 218, 160, 0.3)',
      danger: 'rgba(255, 102, 112, 0.3)',
      default: 'rgba(173, 226, 230, 0.1)',
      icon: 'transparent',
      link: 'transparent',
    },
    color: {
      simple: '#ffffff',
      create: '#ffffff',
      danger: defaultTextColor,
      default: defaultTextColor,
      icon: defaultIconColor,
      link: defaultTextColor,
    },
    hover: {
      background: {
        simple: 'rgba(161, 218, 160, 0.2)',
        create: 'rgba(161, 218, 160, 0.5)',
        danger: 'rgba(255, 102, 112, 0.5)',
        default: 'rgba(173, 226, 230, 0.3)',
        icon: 'rgba(173, 226, 230, 0.3)',
        link: 'transparent',
      },
      color: {
        simple: '#ffffff',
        create: defaultTextColor,
        danger: 'white',
        default: '#ffffff',
        icon: defaultTextColor,
        link: defaultTextColor,
      },
    },
  },
  chip: {
    background: {
      default: 'rgba(173, 226, 230, 0.3)',
      success: 'rgba(161, 218, 160, 0.25)',
      error: 'rgba(255, 102, 112, 0.5)',
    },
    border: {
      default: '1px solid rgba(173, 226, 230, 0.3)',
      success: '1px solid rgba(161, 218, 160, 0.25)',
      error: '1px solid rgba(255, 102, 112, 0.5)',
    },
    hover: {
      border: {
        default: '1px solid rgba(173, 226, 230, 1)',
        success: '1px solid rgba(161, 218, 160, 1)',
        error: '1px solid rgba(255, 102, 112, 1)',
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
      readOnly: 'rgba(255, 255, 255, 0.03)',
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
      readOnly: '#bbbbbb',
      enhancer: '#007079',
      placeholder: '#bbbbbb',
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
  message: {
    background: {
      default: 'rgba(173, 226, 230, 0.1)',
      warning: 'rgba(255, 198, 122, 0.1)',
      error: 'rgba(255, 102, 112, 0.1)',
      success: 'rgba(161, 218, 160, 0.1)',
    },
    icon: {
      default: defaultIconColor,
      warning: '#FFC67A',
      error: 'rgb(255, 102, 112)',
      success: 'rgb(161, 218, 160)',
    },
  },
};
