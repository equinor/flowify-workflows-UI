import React, { FC, useContext } from 'react';
import { SettingsContextStore } from '../../common/context/editor-settings-context';
import { lightTheme, darkTheme } from '.';
import { ThemeProvider } from 'styled-components';

interface ThemeSelectorProps {
  children?: React.ReactNode;
}

export const ThemeSelector: FC<ThemeSelectorProps> = (props: ThemeSelectorProps) => {
  const { settings } = useContext(SettingsContextStore);
  return <ThemeProvider theme={settings?.darkTheme ? darkTheme : lightTheme}>{props.children}</ThemeProvider>;
};
