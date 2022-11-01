import React, { FC, useState, useContext } from 'react';
import { Tooltip, Typography } from '@equinor/eds-core-react';
import { SettingsContextStore } from '../../../../common/context/editor-settings-context';
import { Button, DialogWrapper, MultiToggle, ToggleButton, Stack, Modal } from '../../../ui';

interface IEditorSettings {}

export const EditorSettings: FC<IEditorSettings> = (props: IEditorSettings) => {
  const [open, setOpen] = useState<boolean>(false);
  const { settings, updateSetting } = useContext(SettingsContextStore);

  return (
    <>
      <Tooltip title="Editor preferences" style={{ fontSize: '1rem' }}>
        <Button theme="icon" icon="tune" onClick={() => setOpen(true)} />
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogWrapper spacing={2} padding={2}>
          <Typography variant="h5">Manifest options</Typography>
          <Stack spacing={1}>
            <MultiToggle label="Wordwrap">
              <ToggleButton active={settings?.wordWrap} onClick={() => updateSetting('wordWrap', true)}>
                Enable
              </ToggleButton>
              <ToggleButton active={!settings?.wordWrap} onClick={() => updateSetting('wordWrap', false)}>
                Disable
              </ToggleButton>
            </MultiToggle>
            <MultiToggle label="Minimap">
              <ToggleButton active={settings?.miniMap} onClick={() => updateSetting('miniMap', true)}>
                Enable
              </ToggleButton>
              <ToggleButton active={!settings?.miniMap} onClick={() => updateSetting('miniMap', false)}>
                Disable
              </ToggleButton>
            </MultiToggle>
            <MultiToggle label="Theme">
              <ToggleButton active={settings?.darkTheme} onClick={() => updateSetting('darkTheme', true)}>
                Dark
              </ToggleButton>
              <ToggleButton active={!settings?.darkTheme} onClick={() => updateSetting('darkTheme', false)}>
                Light
              </ToggleButton>
            </MultiToggle>
          </Stack>
          <MultiToggle label="Manifest language">
            <ToggleButton active={settings?.language === 'yaml'} onClick={() => updateSetting('language', 'yaml')}>
              YAML
            </ToggleButton>
            <ToggleButton active={settings?.language === 'json'} onClick={() => updateSetting('language', 'json')}>
              JSON
            </ToggleButton>
          </MultiToggle>
        </DialogWrapper>
      </Modal>
    </>
  );
};
