import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as EDSButton, Snackbar } from '@equinor/eds-core-react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Component } from '@models/v2';
import { services } from '@services';
import { DialogWrapper, Modal } from '@ui';
import { BaseInputFormik } from '@form';
import { Submitter } from './submitter';
import { CreateComponentProps } from './types';

/**
 * Create component
 * Modal that handles the creation of a new marketplace component. Modal state is handled from the parent and passed as prop.
 * Handles name setting, validation and api calls -> navigates user to editor after component is created.
 */

const CreateComponent: FC<CreateComponentProps> = (props: CreateComponentProps) => {
  const { open, setOpen } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required('Component name is a required field'),
  });

  const onSubmit = (values: Component) => {
    if (!values || submitting) {
      return Promise.resolve();
    }
    setSubmitting(true);
    services.components
      .create(values)
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
      <Modal maxWidth="sm" fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogWrapper padding={2}>
          <Formik
            initialValues={{
              type: 'component',
              name: 'new-component',
              inputs: [],
              outputs: [],
              implementation: { type: 'any' },
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <BaseInputFormik name="name" label="Component name" />
              <Submitter onClose={() => setOpen(false)} submitting={submitting} />
            </Form>
          </Formik>
        </DialogWrapper>
      </Modal>
    </>
  );
};

export default CreateComponent;
