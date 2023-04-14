import React, { FC, useContext } from 'react';
import { ThemeProvider as OPTThemeProvider } from '@equinor/opt-ui-core';
import { SettingsContextStore } from '../../common/context/editor-settings-context';
import { lightTheme, darkTheme } from '.';
import { ThemeProvider } from 'styled-components';

interface ThemeSelectorProps {
  children?: React.ReactNode;
}

export const ThemeSelector: FC<ThemeSelectorProps> = (props: ThemeSelectorProps) => {
  const { settings } = useContext(SettingsContextStore);
  return (
    <ThemeProvider theme={settings?.darkTheme ? darkTheme : lightTheme}>
      <OPTThemeProvider theme={{ mode: settings?.darkTheme ? 'dark' : 'light' }}>
        {props.children}
      </OPTThemeProvider>
    </ThemeProvider>
  );
};
