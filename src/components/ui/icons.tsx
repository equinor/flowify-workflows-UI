import React from 'react';
import { IconProps } from '@equinor/eds-core-react';
import { addTheme } from '.';
import * as S from '../../styles/components';

export const IconsWrapper = (props: { children: React.ReactNode }) =>
  addTheme(<S.IconsWrapper>{props.children}</S.IconsWrapper>);

export const FlowifyIcon = (props: IconProps) => addTheme(<S.FlowifyIcon name={props.name} size={props.size} />);

export const ComponentIcon = (props: { size?: 16 | 24 | 32 | 40 }) => (
  <svg
    className={`flowify--icon flowify--icon--${props.size}`}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.17 23.68c-.08.25-.27.36-.52.3-2.96-.66-4.43-2.6-4.43-5.25v-1.42c0-2.16-.1-3.33-1.85-3.5-.27-.02-.4-.2-.4-.44v-1.74c0-.25.13-.42.4-.44 1.74-.17 1.85-1.34 1.85-3.5V6.27C3.22 3.6 4.7 1.68 7.65 1c.25-.05.44.06.52.31l.54 1.51c.11.28-.02.45-.3.5-2 .42-2.74 1.46-2.74 3.5v1.42c0 1.8-.25 3.3-1.93 4.25 1.68.95 1.93 2.46 1.93 4.25v1.42c0 2.04.73 3.08 2.74 3.5.28.05.41.22.3.5l-.54 1.5Z"
      fill="#004F55"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.9 1.32c.09-.25.28-.36.52-.3 2.97.66 4.43 2.6 4.43 5.25v1.42c0 2.16.11 3.33 1.85 3.5.28.02.41.2.41.44v1.74c0 .25-.13.42-.4.44-1.75.17-1.86 1.34-1.86 3.5v1.42c0 2.66-1.46 4.59-4.43 5.26-.24.05-.43-.06-.51-.31l-.55-1.51c-.1-.28.03-.45.3-.5 2.01-.42 2.75-1.46 2.75-3.5v-1.42c0-1.8.24-3.3 1.93-4.25-1.69-.95-1.93-2.46-1.93-4.25V6.83c0-2.04-.74-3.08-2.75-3.5-.27-.05-.4-.22-.3-.5l.55-1.5Z"
      fill="#709DA0"
    />
  </svg>
);

export const WorkflowIcon = (props: { size?: 16 | 24 | 32 | 40 }) => (
  <svg
    className={`flowify--icon flowify--icon--${props.size}`}
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 7L5 12L20 19" stroke="#709DA0" />
    <rect x="1" y="8" width="8" height="8" rx="1" fill="#004F55" />
    <rect x="16" y="3" width="8" height="8" rx="1" fill="#004F55" />
    <rect x="16" y="15" width="8" height="8" rx="1" fill="#709DA0" />
  </svg>
);
