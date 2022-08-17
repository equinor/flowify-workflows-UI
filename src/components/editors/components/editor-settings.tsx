import React, { FC, useState, useContext } from 'react';
import { Button, Icon, Radio, Switch, Tooltip, Typography } from '@equinor/eds-core-react';
import { Dialog, Stack } from '@mui/material';
import {
  SettingsContextStore,
  IEditorSettings as SettingsInterface,
} from '../../../common/context/editor-settings-context';

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
        <Button onClick={() => setOpen(true)} variant="ghost_icon" style={{ fontSize: '1rem' }}>
          <Icon name="tune" />
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <Stack spacing={2} sx={{ padding: '2rem' }}>
          <div>
            <Typography variant="h5">Manifest options</Typography>
            <Stack>
              <Switch
                checked={settings?.wordWrap}
                label="Use word-wrap"
                onChange={() => updateSettingBoolean('wordWrap')}
              />
              <Switch
                checked={settings?.miniMap}
                label="Show minimap"
                onChange={() => updateSettingBoolean('miniMap')}
              />
              <Switch
                checked={settings?.darkTheme}
                label="Dark theme"
                onChange={() => updateSettingBoolean('darkTheme')}
              />
            </Stack>
          </div>
          <div>
            <Typography variant="h5">Manifest language</Typography>
            <Stack role="radiogroup" direction="row" spacing={2}>
              <Radio
                label="YAML"
                name="editor_lang_yaml"
                checked={settings.language === 'yaml'}
                value="yaml"
                onChange={() => updateSettingValue('language', 'yaml')}
              />
              <Radio
                label="JSON"
                name="editor_lang_json"
                checked={settings.language === 'json'}
                value="json"
                onChange={() => updateSettingValue('language', 'json')}
              />
            </Stack>
          </div>
        </Stack>
      </Dialog>
    </>
  );
};
