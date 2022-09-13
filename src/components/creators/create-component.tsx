import React, { FC, useState } from 'react';
import { Dialog, Stack } from '@mui/material';
import { Button as EDSButton, Progress, Snackbar } from '@equinor/eds-core-react';
import { useNavigate } from 'react-router-dom';
import { Component } from '../../models/v2';
import { services } from '../../services/v2';
import { Button, TextField } from '../ui';

const makeComponent = (): Component => ({
  type: 'component',
  name: 'new-component',
  inputs: [],
  outputs: [],
  implementation: { type: 'any' },
});

interface ICreateComponent {
  open: boolean;
  setOpen: (state: boolean) => void;
}

const CreateComponent: FC<ICreateComponent> = (props: ICreateComponent) => {
  const { open, setOpen } = props;
  const [component, setComponent] = useState<Component>(makeComponent());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = () => {
    if (!component || submitting) {
      return Promise.resolve();
    }
    setSubmitting(true);
    services.components
      .create(component)
      .then((res) => {
        if (res) {
          navigate(`/component/${res.uid}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setSubmitting(false);
        setError(true);
      });
  };

  function onNameChange(value: string) {
    setComponent((prev: Component) => ({
      ...prev,
      name: value,
    }));
  }

  return (
    <>
      {error && (
        <Snackbar open={error} onClose={() => setError(false)}>
          Could not create component. {error}
          <Snackbar.Action>
            <EDSButton onClick={() => setError(false)} variant="ghost">
              Close
            </EDSButton>
          </Snackbar.Action>
        </Snackbar>
      )}
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ padding: '2rem' }} spacing={2}>
          <TextField
            id="new-component-name"
            label="Component name"
            defaultValue={component?.name}
            onBlur={(event: any) => onNameChange(event.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button theme="simple" onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button theme="create" onClick={onSubmit}>
              {submitting ? (
                <>
                  <Progress.Circular size={16} color="neutral" />
                  Creating…
                </>
              ) : (
                'Create component'
              )}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default CreateComponent;
