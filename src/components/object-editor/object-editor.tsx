import React, { useState, useContext, FC } from 'react';
import jsyaml from 'js-yaml';
import { Dialog, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import { StyledManifestWrapper } from '../editors/styles/styles';
import { SettingsContextStore } from '../../common/context/editor-settings-context';
import { Button, Icon, Typography } from '@equinor/eds-core-react';

function parse<T>(value: string): T {
  if (value.startsWith('{')) {
    return JSON.parse(value);
  }
  return jsyaml.load(value) as T;
}

type languages = 'json' | 'yaml';
const defaultLang: languages = 'yaml';

function stringify<T>(value: T, lang: languages): string {
  return lang === 'yaml' ? jsyaml.dump(value, { noRefs: true }) : JSON.stringify(value, null, '  ');
}

interface IError {
  message: string;
  name: string;
  reason: string;
}

interface ObjectEditorProps {
  value: any;
  lang?: languages;
  onChange?: (value: any) => void;
  onSave?: () => void;
}

export const ObjectEditor: FC<ObjectEditorProps> = (props: ObjectEditorProps) => {
  const { value, onChange } = props;

  const { settings } = useContext(SettingsContextStore);
  const [error, setError] = useState<IError | null>();
  const [errorDialog, setErrorDialog] = useState<boolean>(false);

  return (
    <StyledManifestWrapper error={error !== null}>
      <Editor
        value={stringify(value, settings.language ?? defaultLang)}
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
      {typeof props.onSave === 'function' && (
        <Button onClick={props.onSave} style={{ position: 'absolute', right: 16, marginTop: 8 }}>
          <Icon name="save" /> Save changes
        </Button>
      )}
    </StyledManifestWrapper>
  );
};

ObjectEditor.defaultProps = {
  onChange: undefined,
  onSave: undefined,
};
