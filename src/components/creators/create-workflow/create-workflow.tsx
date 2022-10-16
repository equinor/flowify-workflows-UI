import React, { FC, useState } from 'react';
import { Icon, Snackbar } from '@equinor/eds-core-react';
import { Dialog } from '@mui/material';
import { useNavigate } from 'react-router';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Workflow } from '../../../models/v2/workflow';
import { services } from '../../../services';
import { Button, DialogWrapper, Stack } from '../../ui';
import { Submitter } from '../create-component/submitter';
import { TextInputFormik } from '../../form';

const makeWorkflow = (workspace: string): Workflow => ({
  type: 'workflow',
  workspace,
  name: 'New workflow',
  component: {
    type: 'component',
    implementation: {
      type: 'any',
    },
  },
});

interface ICreateWorkflow {
  workspace: string;
}

const CreateWorkflow: FC<ICreateWorkflow> = (props: ICreateWorkflow) => {
  const { workspace } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required('Workflow name is required'),
  });

  function onSubmit(values: Workflow) {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    if (values) {
      services.workflows
        .create(values)
        .then((res) => {
          const { uid } = res;
          if (uid) {
            navigate(`/workspace/${workspace}/workflow/${uid}`);
          }
        })
        .catch((error) => {
          console.error(error);
          setSubmitting(false);
          setErrorSnackbar(true);
        });
    }
  }

  return (
    <div>
      <Snackbar open={errorSnackbar} onClose={() => setErrorSnackbar(false)}>
        Could not create workflow.
        <Snackbar.Action>
          <Button onClick={() => setErrorSnackbar(false)} theme="simple">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <Button theme="create" onClick={() => setModalOpen(true)}>
        <Icon name="add" />
        Add new Workflow
      </Button>
      <Dialog fullWidth open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogWrapper padding={2}>
          <Formik
            onSubmit={onSubmit}
            initialValues={{ ...makeWorkflow(workspace) }}
            validationSchema={validationSchema}
          >
            <Form>
              <Stack spacing={2}>
                <TextInputFormik name="workspace" label="Workspace" readOnly />
                <TextInputFormik name="name" label="Workflow name" />
              </Stack>
              <Submitter type="workflow" onClose={() => setModalOpen(false)} submitting={submitting} />
            </Form>
          </Formik>
        </DialogWrapper>
      </Dialog>
    </div>
  );
};

export default CreateWorkflow;
