import React from 'react';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import './common/icons';
import './styles/scss/index.scss';
import './common/validation/yup-config';
import Pages from './routes';
import { CurrentUserProvider } from './common/context/user-context-store';
import { EditorSettingsProvider } from './common/context/editor-settings-context';
import { AuthProvider } from './auth';
import { lightTheme, darkTheme } from './styles/theme';

function App() {
  return (
    <CurrentUserProvider>
      <AuthProvider>
        <HelmetProvider>
          <EditorSettingsProvider>
            <SnackbarProvider maxSnack={3}>
              <ThemeProvider theme={darkTheme}>
                <Pages />
              </ThemeProvider>
            </SnackbarProvider>
          </EditorSettingsProvider>
        </HelmetProvider>
      </AuthProvider>
    </CurrentUserProvider>
  );
}

export default App;
