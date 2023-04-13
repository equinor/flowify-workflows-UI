import React, { FC, useState } from 'react';
import { Button as EDSButton, Icon, Snackbar } from '@equinor/eds-core-react';
import { useNavigate } from 'react-router';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Workflow } from '@models/v2';
import { services } from '@services';
import { Button, DialogWrapper, Stack, Modal } from '@ui';
import { TextInputFormik } from '@form';
import { uuid, useUser, useWorkspaces } from '@common';
import { Submitter } from '../create-component/submitter';
import { CreateWorkflowProps } from './types';

/**
 * Create workflow
 * Modal that handles the creation of a new workspace workflow.
 * Handles name setting, validation and api calls -> navigates user to editor after workflow is created.
 */

const CreateWorkflow: FC<CreateWorkflowProps> = (props: CreateWorkflowProps) => {
  const { workspace } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const { getWorkspaceItem } = useWorkspaces();
  const workspaceItem = getWorkspaceItem(workspace);

  const { checkIfUserIsWorkflowCreator } = useUser();

  const showAddWorkflowButton = checkIfUserIsWorkflowCreator(workspaceItem);

  if (!showAddWorkflowButton) return null;

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
          <EDSButton onClick={() => setErrorSnackbar(false)} variant="ghost">
            Close
          </EDSButton>
        </Snackbar.Action>
      </Snackbar>
      <Button theme="create" onClick={() => setModalOpen(true)}>
        <Icon name="add" />
        Add new Workflow
      </Button>
      <Modal maxWidth="sm" fullWidth open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogWrapper padding={2}>
          <Formik
            onSubmit={onSubmit}
            initialValues={{
              type: 'workflow',
              workspace,
              name: 'New workflow',
              component: {
                uid: uuid(),
                type: 'component',
                implementation: {
                  type: 'any',
                },
              },
            }}
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
      </Modal>
    </div>
  );
};

export default CreateWorkflow;
