import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './common/icons';
import './styles/scss/index.scss';
import './common/validation/yup-config';
import Pages from './routes';
import { CurrentUserProvider } from './common/context/user-context-store';
import { EditorSettingsProvider } from './common/context/editor-settings-context';
import { AuthProvider } from './auth';
import { ThemeSelector } from './styles/theme/theme-selector';

function App() {
  return (
    <CurrentUserProvider>
      <AuthProvider>
        <HelmetProvider>
          <EditorSettingsProvider>
            <ThemeSelector>
              <Pages />
            </ThemeSelector>
          </EditorSettingsProvider>
        </HelmetProvider>
      </AuthProvider>
    </CurrentUserProvider>
  );
}

export default App;
