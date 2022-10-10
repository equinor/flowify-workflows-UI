import React, { createContext, useState } from 'react';

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
  setSettings: any;
}

export const SettingsContextStore = createContext({} as IProvider);

export const EditorSettingsProvider = (props: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<IEditorSettings>(initialSettings);

  const value = { settings, setSettings };

  return <SettingsContextStore.Provider value={value}>{props.children}</SettingsContextStore.Provider>;
};
