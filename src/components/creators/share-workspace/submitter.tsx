import React, { FC } from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@ui';

interface SubmitterProps {
  onClose: () => void;
  submitting?: boolean;
}

export const Submitter: FC<SubmitterProps> = (props: SubmitterProps) => {
  const { onClose, submitting } = props;
  const { isValid, setTouched, submitForm } = useFormikContext();
  function trySubmit() {
    submitForm().then(() => {
      if (isValid) {
        return;
      }
      setTouched({
        name: true,
      });
    });
  }

  return (
    <Stack style={{ marginTop: '2rem' }} spacing={2} direction="row" justifyContent="flex-end">
      <Button theme="simple" onClick={onClose}>
        Close
      </Button>
      <Button theme="create" onClick={trySubmit} loading={submitting}>
        {submitting ? `Sharing a workspace…` : `Share a workspace`}
      </Button>
    </Stack>
  );
};
