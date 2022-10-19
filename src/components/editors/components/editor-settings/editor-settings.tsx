import React, { FC, useState, useContext } from 'react';
import { Tooltip, Typography } from '@equinor/eds-core-react';
import { Dialog, Stack } from '@mui/material';
import {
  SettingsContextStore,
  IEditorSettings as SettingsInterface,
} from '../../../../common/context/editor-settings-context';
import { Button, DialogWrapper, MultiToggle, ToggleButton } from '../../../ui';

interface IEditorSettings {}

export const EditorSettings: FC<IEditorSettings> = (props: IEditorSettings) => {
  const [open, setOpen] = useState<boolean>(false);
  const { settings, setSettings } = useContext(SettingsContextStore);

  function updateSettingBoolean(name: string) {
    setSettings((prev: SettingsInterface) => ({
      ...prev,
      //@ts-expect-error
      [name]: !prev[name],
    }));
  }

  function updateSettingValue(name: string, value: string) {
    setSettings((prev: SettingsInterface) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <Tooltip title="Editor preferences" style={{ fontSize: '1rem' }}>
        <Button theme="icon" icon="tune" onClick={() => setOpen(true)} />
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogWrapper spacing={2} padding={2}>
          <Typography variant="h5">Manifest options</Typography>
          <Stack spacing={2}>
            <MultiToggle label="Wordwrap">
              <ToggleButton active={settings?.wordWrap} onClick={() => updateSettingBoolean('wordWrap')}>
                Enable
              </ToggleButton>
              <ToggleButton active={!settings?.wordWrap} onClick={() => updateSettingBoolean('wordWrap')}>
                Disable
              </ToggleButton>
            </MultiToggle>
            <MultiToggle label="Minimap">
              <ToggleButton active={settings?.miniMap} onClick={() => updateSettingBoolean('miniMap')}>
                Enable
              </ToggleButton>
              <ToggleButton active={!settings?.miniMap} onClick={() => updateSettingBoolean('miniMap')}>
                Disable
              </ToggleButton>
            </MultiToggle>
            <MultiToggle label="Theme">
              <ToggleButton active={settings?.darkTheme} onClick={() => updateSettingBoolean('darkTheme')}>
                Dark
              </ToggleButton>
              <ToggleButton active={!settings?.darkTheme} onClick={() => updateSettingBoolean('darkTheme')}>
                Light
              </ToggleButton>
            </MultiToggle>
          </Stack>
          <MultiToggle label="Manifest language">
            <ToggleButton active={settings?.language === 'yaml'} onClick={() => updateSettingValue('language', 'yaml')}>
              YAML
            </ToggleButton>
            <ToggleButton active={settings?.language === 'json'} onClick={() => updateSettingValue('language', 'json')}>
              JSON
            </ToggleButton>
          </MultiToggle>
        </DialogWrapper>
      </Dialog>
    </>
  );
};
