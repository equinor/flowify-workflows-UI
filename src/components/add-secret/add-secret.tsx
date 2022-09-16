import React, { FC, useEffect, useState } from 'react';
import { Icon, Banner, Progress } from '@equinor/eds-core-react';
import { Dialog, DialogTitle, Stack } from '@mui/material';
import { ISecret } from '../../models/v2';
import { Button, TextField } from '../ui';

interface IAddSecret {
  addKey: (values: ISecret) => Promise<string> | string;
}

const AddSecret: FC<IAddSecret> = (props: IAddSecret) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<ISecret>({ key: '', value: '' });
  const [endsWithSpace, setEndsWithSpace] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handlePost() {
    if (submitting) {
      return;
    }
    setError(false);
    setSubmitting(true);
    const result = await props.addKey(inputValues);
    if (result === 'SUCCESSFUL') {
      setModalOpen(false);
      setInputValues({ key: '', value: '' });
      setSubmitting(false);
      return;
    }
    if (result === 'ERROR') {
      setError(true);
      setSubmitting(false);
    }
  }

  useEffect(() => {
    setEndsWithSpace(false);
    if (inputValues.value !== '') {
      const end = inputValues?.value?.slice(-1);
      if (end === ' ') {
        setEndsWithSpace(true);
      }
    }
  }, [inputValues.value]);

  function onClose() {
    setInputValues({ key: '', value: '' });
    setModalOpen(false);
    setError(false);
  }

  return (
    <div>
      <Button theme="create" onClick={() => setModalOpen(true)}>
        <Icon name="add" />
        Add new secret
      </Button>
      <Dialog fullWidth open={modalOpen} onClose={onClose}>
        <DialogTitle>Add secret</DialogTitle>
        <Stack spacing={4} sx={{ padding: '0 2rem 2rem' }}>
          <TextField
            id="secrets_key_input"
            label="Secret key"
            autoFocus
            value={inputValues?.key}
            onChange={(e: any) => setInputValues((prev) => ({ ...prev, key: e.target.value }))}
          />
          <TextField
            id="secrets_value_input"
            label="Secret value"
            multiline
            rows={3}
            style={{ resize: 'none' }}
            value={inputValues?.value}
            onChange={(e: any) => setInputValues((prev) => ({ ...prev, value: e.target.value }))}
          />
          {error && (
            <Banner>
              <Banner.Icon variant="warning">
                <Icon name="warning_outlined" />
              </Banner.Icon>
              <Banner.Message>Secret could not be added. Please try again.</Banner.Message>
            </Banner>
          )}
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
            <Button theme="create" onClick={handlePost}>
              {submitting ? (
                <>
                  <Progress.Circular size={16} color="neutral" /> Adding secret…
                </>
              ) : (
                'Add secret'
              )}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </div>
  );
};

export default AddSecret;
