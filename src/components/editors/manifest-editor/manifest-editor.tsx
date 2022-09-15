import React, { useState, useContext, FC } from 'react';
import { Dialog, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import { Button, Typography } from '@equinor/eds-core-react';
import { StyledManifestWrapper } from './styles';
import { SettingsContextStore } from '../../../common/context/editor-settings-context';
import { DEFAULT_LANGUAGE, IError, ManifestEditorProps } from './types';
import { parse, stringify } from './helpers';

export const ManifestEditor: FC<ManifestEditorProps> = (props: ManifestEditorProps) => {
  const { value, onChange } = props;

  const { settings } = useContext(SettingsContextStore);
  const [error, setError] = useState<IError | null>();
  const [errorDialog, setErrorDialog] = useState<boolean>(false);

  return (
    <StyledManifestWrapper error={error !== null}>
      <Editor
        value={stringify(value, settings.language ?? DEFAULT_LANGUAGE)}
        language={settings.language}
        theme={settings.darkTheme ? 'vs-dark' : 'vs-light'}
        options={{
          readOnly: onChange === null,
          minimap: { enabled: settings.miniMap },
          scrollBeyondLastLine: true,
          wordWrap: settings.wordWrap ? 'on' : 'off',
        }}
        onChange={(v: string | undefined) => {
          if (onChange) {
            try {
              onChange(parse(v ?? ''));
              setError(null);
            } catch (e: any) {
              console.log(e);
              setError(e);
            }
          }
        }}
      />
      {error && (
        <>
          <Button
            variant="ghost"
            onClick={() => setErrorDialog(true)}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
            color="danger"
          >
            View Error(s)
          </Button>
          <Dialog open={errorDialog} onClose={() => setErrorDialog(false)} fullWidth maxWidth="md">
            <Stack sx={{ padding: '2rem' }}>
              <Typography variant="h5">{error.reason}</Typography>
              <Typography variant="body_long">{error.message}</Typography>
            </Stack>
          </Dialog>
        </>
      )}
    </StyledManifestWrapper>
  );
};

ManifestEditor.defaultProps = {
  onChange: undefined,
};
