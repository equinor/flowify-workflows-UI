import React, { FC } from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@ui';

interface SubmitterProps {
  onClose: () => void;
  submitting?: boolean;
  type?: 'component' | 'workflow' | 'workspace';
}

export const Submitter: FC<SubmitterProps> = (props: SubmitterProps) => {
  const { onClose, submitting, type } = props;
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
        {submitting ? `Creating new ${type}…` : `Create new ${type}`}
      </Button>
    </Stack>
  );
};

Submitter.defaultProps = {
  type: 'component',
};
