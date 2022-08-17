import React from 'react';
import { SnackbarProvider } from 'notistack';
import './common/icons';
import './styles/scss/index.scss';
import Pages from './routes';
import { CurrentUserProvider } from './common/context/user-context-store';
import { EditorSettingsProvider } from './common/context/editor-settings-context';
import { AuthProvider } from './auth';

function App() {
  return (
    <CurrentUserProvider>
      <AuthProvider>
        <EditorSettingsProvider>
          <SnackbarProvider maxSnack={3}>
            <Pages />
          </SnackbarProvider>
        </EditorSettingsProvider>
      </AuthProvider>
    </CurrentUserProvider>
  );
}

export default App;
