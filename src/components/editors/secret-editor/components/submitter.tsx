import React, { FC } from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@ui';

interface SubmitterProps {
  mode?: 'edit' | 'create';
  onClose: () => void;
  submitting?: boolean;
}

export const Submitter: FC<SubmitterProps> = (props: SubmitterProps) => {
  const { onClose, mode, submitting } = props;
  const { isValid, setTouched, submitForm } = useFormikContext();
  function trySubmit() {
    submitForm().then(() => {
      if (isValid) {
        console.log('valid form');
        return;
      }
      setTouched({
        key: true,
        value: true,
      });
    });
  }

  return (
    <Stack spacing={2} direction="row" justifyContent="flex-end">
      <Button theme="simple" onClick={onClose}>
        Close
      </Button>
      <Button theme="create" onClick={trySubmit} loading={submitting}>
        {submitting
          ? mode === 'create'
            ? 'Adding secret…'
            : 'Updating secret…'
          : mode === 'create'
          ? 'Add secret'
          : 'Update secret'}
      </Button>
    </Stack>
  );
};
