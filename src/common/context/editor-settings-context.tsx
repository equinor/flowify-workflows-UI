import React, { createContext, useEffect, useState } from 'react';

export interface IEditorSettings {
  miniMap: boolean;
  wordWrap: boolean;
  darkTheme: boolean;
  language: 'yaml' | 'json';
}

const initialSettings: IEditorSettings = {
  miniMap: false,
  wordWrap: false,
  darkTheme: false,
  language: 'json',
};

interface IProvider {
  settings: IEditorSettings;
  updateSetting: (name: keyof IEditorSettings, value: string | boolean) => void;
}

export const SettingsContextStore = createContext({} as IProvider);

export const EditorSettingsProvider = (props: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<IEditorSettings>(initialSettings);

  function updateSettings(settings: IEditorSettings) {
    setSettings(settings);
    localStorage?.setItem('flowify-usersettings', JSON.stringify(settings));
  }

  useEffect(() => {
    const items = localStorage?.getItem('flowify-usersettings');
    if (items) {
      updateSettings(JSON.parse(items));
      return;
    }
    const darkTheme = window?.matchMedia && window?.matchMedia('(prefers-color-scheme: dark)').matches;
    const withTheme = { ...initialSettings, darkTheme };
    updateSettings(withTheme);
  }, []);

  function updateSetting(name: keyof IEditorSettings, value: string | boolean) {
    const updated = { ...settings, [name]: value };
    updateSettings(updated);
  }

  const value = { settings, updateSetting };

  return <SettingsContextStore.Provider value={value}>{props.children}</SettingsContextStore.Provider>;
};
