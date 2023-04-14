import React, { FC, useState } from 'react';
import { Button as EDSButton, Snackbar } from '@equinor/eds-core-react';
import { Modal as OPTModal, RadioGroup, Radio } from '@equinor/opt-ui-core';
import { Share } from '@equinor/opt-ui-icons';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Workspace, WorkspaceOwnership } from '@models/v2';
import { services } from '@services';
import { Button, DialogWrapper, Stack, Modal } from '@ui';
import { useUser, useWorkspaces } from '@common';
import { TextInputFormik } from '@form';
import { Feedback,  Feedbacks } from '../../../components/editors/components/feedbacks/feedbacks';
import { Submitter } from './submitter';
import { ShareWorkspaceProps } from './types';

const ErrorMessages = {
  default: 'Could not share a workspace.',
  alreadyShared: 'The workspace is already shared with the user'
};

/**
 * Share workspace
 * Modal that handles the sharing of a workspace.
 * Handles user name setting, validation and api calls -> success notification.
 */

const ShareWorkspace: FC<ShareWorkspaceProps> = (props: ShareWorkspaceProps) => {
  const { workspace } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [ownershipType, setOwnershipType] = useState<WorkspaceOwnership>(WorkspaceOwnership.Collaborator);
  const [errorMessage, setErrorMessage] = useState<string>(ErrorMessages.default)
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [warningContinueItem, setWarningContinueItem] = useState<Workspace|null>(null);
  const [warningModal, setWarningModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>();
  

  const { getWorkspaceItem, resetWorkspacesTimestamp } = useWorkspaces();
  const workspaceItem = getWorkspaceItem(workspace);

  const { checkIfUserIsWorkspaceEditor } = useUser();
  const showShareButton = checkIfUserIsWorkspaceEditor(workspaceItem);

  if (!showShareButton) return null;

  const onCloseError = () => {
    setErrorMessage(ErrorMessages.default);
    setErrorSnackbar(false);
  };

  const onCloseWarning = () => {
    setWarningMessage('');
    setWarningContinueItem(null);
    setWarningModal(false);
  };

  const onContinue = () => {
    if (warningContinueItem) {
      handleSubmit(warningContinueItem);
    }
    onCloseWarning();
  };

  const validationSchema = yup.object({
    email: yup.string().required('User email is required').email(),
  });

  const handleSubmit = (w: Workspace) => {
    services.workspace
    .update(w)
    .then((res) => {
      if (res) {
        setFeedback({ message: 'Workspace was shared successfully.', type: 'success' });
        setModalOpen(false);
        setSubmitting(false);
        resetWorkspacesTimestamp(null);
      }
    })
    .catch((error) => {
      console.error(error);
      setSubmitting(false);
      setErrorSnackbar(true);
    });
  };

  function onSubmit(values: any) {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    if (values && workspaceItem) {
      const { email } = values;
      const { roles } = workspaceItem;
      const customRole = `${email}--$${ownershipType}`;

      // prevent submit when the user already have the workspace role
      if (roles.includes(customRole)) {
        setErrorMessage(`${ErrorMessages.alreadyShared} <${email}>`);
        setErrorSnackbar(true);
        setSubmitting(false);
        return;
      }

      const nextRoles = [ ...workspaceItem.roles, customRole];
      const nextWorkspaceItem = {
        ...workspaceItem,
        roles: nextRoles,
      }

      const oppositeOwnershipType = ownershipType === WorkspaceOwnership.Owner ? WorkspaceOwnership.Collaborator : WorkspaceOwnership.Owner;
      const oppositeCustomRole = `${email}--$${oppositeOwnershipType}`;

      // allow submit when the user do not have the opposite workspace role
      if (!roles.includes(oppositeCustomRole)) {
        handleSubmit(nextWorkspaceItem);
        return;
      }

      // handle opposite workspace role removal after the user approves the ownership change through warning modal
      setWarningContinueItem({
        ...workspaceItem,
        roles: nextRoles.filter((r) => r !== oppositeCustomRole),
      });
      const message = oppositeOwnershipType === WorkspaceOwnership.Owner
        ? `downgrade the user <${email}> to the workspace ${WorkspaceOwnership.Collaborator}`
        : `upgrade the user <${email}> to the workspace ${WorkspaceOwnership.Owner}`;
      setWarningMessage(message);
      
      setModalOpen(false);
      setSubmitting(false);

      setWarningModal(true);
    }
  }

  return (
    <>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} />
      <Snackbar open={errorSnackbar} onClose={onCloseError}>
        {errorMessage}
        <Snackbar.Action>
          <EDSButton onClick={onCloseError} variant="ghost">
            Close
          </EDSButton>
        </Snackbar.Action>
      </Snackbar>
      <Button theme="simple" aria-label="Share icon button" onClick={() => setModalOpen(true)}>
        <Share />
      </Button>
      <Modal maxWidth="sm" fullWidth open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogWrapper padding={2} basis='content'>
          <Formik
            onSubmit={onSubmit}
            initialValues={{
              workspace,
              email: '',
            }}
            validationSchema={validationSchema}
          >
            <Form>
              <Stack spacing={2}>
                <TextInputFormik name="workspace" label="Workspace" readOnly />
                <RadioGroup direction='horizontal' defaultValue={ownershipType} onChange={({ target: { value } }) => setOwnershipType(value as WorkspaceOwnership)}>
                  <Radio name="radios" value={WorkspaceOwnership.Owner} />
                  <Radio name="radios" value={WorkspaceOwnership.Collaborator} />
                </RadioGroup>
                <TextInputFormik name="email" label="User email" type="email" />
              </Stack>
              <Submitter onClose={() => setModalOpen(false)} submitting={submitting} />
            </Form>
          </Formik>
        </DialogWrapper>
      </Modal>
      <OPTModal
        open={warningModal}
        onClose={onCloseWarning}
        title="Workspace sharing"
        footer={[
          <Button key="modal_cancel" theme='simple' onClick={onCloseWarning}>
            Cancel
          </Button>,
          <Button key="modal_save" theme='create' onClick={onContinue}>
            Continue
          </Button>
        ]}
      >
        <p>Are you sure you want to {warningMessage}?</p>
      </OPTModal>
    </>
  );
};

export default ShareWorkspace;
