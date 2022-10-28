import React, { FC, useState } from 'react';
import { Dialog } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ISecret } from '../../../models/v2';
import { Stack, DialogWrapper } from '../../ui';
import { services } from '../../../services';
import { Feedback } from '../components';
import { TextInputFormik } from '../../form/formik/text-input-formik';
import { Submitter } from './components/submitter';

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
  const [submitting, setSubmitting] = useState<boolean>(false);

  function saveSecret(secret: ISecret) {
    if (secret && !submitting) {
      // Check if no change has happened to the secret
      if (props.secret === secret || !secret.key || !secret.value) {
        onClose();
        return;
      }
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

  const validationSchema = Yup.object({
    key: Yup.string().required('Secret/Token name is a required field.').noWhitespace(),
    value: Yup.string().required(),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogWrapper padding={2}>
        <Stack spacing={2}>
          <Formik initialValues={props.secret} onSubmit={saveSecret} validateOnBlur validationSchema={validationSchema}>
            <Form>
              <Stack spacing={1}>
                <TextInputFormik name="key" label="Secret/Token name" readOnly={mode === 'edit'} />
                <TextInputFormik name="value" label="Value" multiline rows={3} />
                <Submitter mode={mode} submitting={submitting} onClose={onClose} />
              </Stack>
            </Form>
          </Formik>
        </Stack>
      </DialogWrapper>
    </Dialog>
  );
};
