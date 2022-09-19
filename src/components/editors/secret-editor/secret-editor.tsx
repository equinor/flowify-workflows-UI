import React, { FC, useState, useEffect } from 'react';
import { Banner, Icon, Progress } from '@equinor/eds-core-react';
import { Dialog } from '@mui/material';
import { ISecret } from '../../../models/v2';
import { Button, TextField } from '../../ui';
import { Stack } from '../../ui/stack/stack';
import { services } from '../../../services/v2';
import { Feedback } from '../components';

interface SecretEditorProps {
  open: boolean;
  onClose: () => void;
  workspace: string;
  secret: ISecret;
  mode: 'edit' | 'create';
  getSecrets: (workspace: string) => void;
  setFeedback: (feedback: Feedback) => void;
}

export const SecretEditor: FC<SecretEditorProps> = (props: SecretEditorProps) => {
  const { open, onClose, mode, workspace, getSecrets, setFeedback } = props;
  const [secret, setSecret] = useState<ISecret>(props.secret);
  const [endsWithSpace, setEndsWithSpace] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setEndsWithSpace(false);
    if (secret.value !== '') {
      const end = secret?.value?.slice(-1);
      if (end === ' ') {
        setEndsWithSpace(true);
      }
    }
  }, [secret.value]);

  function saveSecret() {
    if (secret && !submitting) {
      // Check if no change has happened to the secret
      if (props.secret === secret || !secret.key || !secret.value) {
        console.log('no change');
        onClose();
        return;
      }
      // Updating existing secret
      setSubmitting(true);
      services.secrets
        .create(secret, workspace)
        .then(() => {
          getSecrets(workspace);
          setSubmitting(false);
          setFeedback({
            message:
              mode === 'create'
                ? `Secret ${secret.key} was successfully added.`
                : `Secret ${secret.key} was successfully updated.`,
            type: 'success',
          });
          onClose();
        })
        .catch((error) => {
          setSubmitting(false);
          setFeedback({
            message:
              mode === 'create'
                ? `Secret ${secret.key} could not be added.`
                : `Secret ${secret.key} could not be updated.`,
            type: 'error',
          });
          console.error(error);
        });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Stack padding={2}>
        <Stack spacing={2}>
          <TextField
            id="secrets_key_input"
            label="Secret key"
            autoFocus
            inputProps={{ readOnly: mode === 'edit' }}
            defaultValue={secret?.key}
            onBlur={(event: any) =>
              setSecret((prev) => ({
                ...prev,
                key: event?.target.value,
              }))
            }
          />
          <TextField
            id="secrets_value_input"
            label="Secret value"
            multiline
            rows={3}
            style={{ resize: 'none' }}
            defaultValue={secret?.value}
            onBlur={(event: any) =>
              setSecret((prev) => ({
                ...prev,
                value: event?.target.value,
              }))
            }
          />
          {endsWithSpace && (
            <Banner>
              <Banner.Icon variant="info">
                <Icon name="warning_outlined" />
              </Banner.Icon>
              <Banner.Message>
                The secret you have written ends with a space character. Please make sure this is on purpose.
              </Banner.Message>
            </Banner>
          )}
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button theme="simple" onClick={onClose}>
              Close
            </Button>
            <Button theme="create" onClick={saveSecret}>
              {submitting ? (
                <>
                  <Progress.Circular size={16} color="neutral" />{' '}
                  {mode === 'create' ? 'Adding secret…' : 'Updating secret…'}
                </>
              ) : mode === 'create' ? (
                'Add secret'
              ) : (
                'Update secret'
              )}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};
