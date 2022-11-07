import React, { useState, useContext, FC } from 'react';
import Editor from '@monaco-editor/react';
import { Typography } from '@equinor/eds-core-react';
import { SettingsContextStore } from '@common';
import { Button, DialogWrapper, Modal } from '@ui';
import { StyledManifestWrapper } from './styles';
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
            theme="danger"
            onClick={() => setErrorDialog(true)}
            style={{ position: 'absolute', bottom: 10, right: 10 }}
          >
            View Error(s)
          </Button>
          <Modal open={errorDialog} onClose={() => setErrorDialog(false)} fullWidth maxWidth="md">
            <DialogWrapper padding={2} spacing={1}>
              <Typography variant="h5">{error.reason}</Typography>
              <Typography variant="body_long">{error.message}</Typography>
            </DialogWrapper>
          </Modal>
        </>
      )}
    </StyledManifestWrapper>
  );
};

ManifestEditor.defaultProps = {
  onChange: undefined,
};
