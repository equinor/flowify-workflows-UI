import { DefaultTheme } from 'styled-components';
import { defaults } from './theme';

const defaultTextColor = 'rgba(61,61,61,1)';
const defaultIconColor = '#007079';

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
      icon: 'transparent',
    },
    color: {
      simple: defaultTextColor,
      create: '#004F55',
      danger: defaultTextColor,
      default: '#18252f',
      icon: defaultTextColor,
    },
    hover: {
      background: {
        simple: '#C9E0E2',
        icon: '#C9E0E2',
        create: '#C3F3D2',
        danger: '#FF6670',
        default: '#C9E0E2',
      },
      color: {
        simple: defaultTextColor,
        icon: defaultTextColor,
        create: '#004F55',
        danger: defaultTextColor,
        default: '#18252f',
      },
    },
  },
  graph: {
    background: 'rgba(0, 0, 0, 0.1)',
    nodes: {
      background: 'white',
      hover: {
        background: '#3E4F5C',
      },
    },
    handle: {
      background: '#0084c4',
    },
  },
  chip: {
    background: {
      default: 'rgba(173, 226, 230, 0.1)',
      success: 'rgba(161, 218, 160, 0.098)',
      error: 'rgba(255, 102, 112, 0.3)',
    },
    hover: {
      background: {
        default: 'rgba(161, 218, 160, 0.2)',
        success: 'rgba(161, 218, 160, 0.25)',
        error: 'rgba(255, 102, 112, 0.5)',
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
      placeholder: '#333333',
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
