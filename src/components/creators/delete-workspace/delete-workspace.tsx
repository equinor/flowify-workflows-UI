import React, { FC, useState } from 'react';
import { Button as EDSButton, Snackbar } from '@equinor/eds-core-react';
import { Modal as OPTModal } from '@equinor/opt-ui-core';
import { DeleteToTrash } from '@equinor/opt-ui-icons';
import { Workspace } from '@models/v2';
import { services } from '@services';
import { Button } from '@ui';
import { useUser, useWorkspaces } from '@common';
import { Feedback,  Feedbacks } from '../../../components/editors/components/feedbacks/feedbacks';
import { DeleteWorkspaceProps } from './types';

const ErrorMessages = {
  default: 'Could not delete a workspace.',
};

/**
 * Delete workspace
 * Modal that handles the deleting of a workspace.
 * Handles user name setting, validation and api calls -> success notification.
 */

const DeleteWorkspace: FC<DeleteWorkspaceProps> = (props: DeleteWorkspaceProps) => {
  const { workspace } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(ErrorMessages.default)
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
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

  const handleSubmit = (w: Workspace) => {
    services.workspace
    .delete(w)
    .then((res) => {
      if (res) {
        setFeedback({ message: 'Workspace was deleted successfully.', type: 'success' });
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

  function onSubmit() {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    if (workspaceItem) {
        handleSubmit(workspaceItem);
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
      <Button theme="danger" aria-label="Delete icon button" onClick={() => setModalOpen(true)}>
        <DeleteToTrash />
      </Button>
      <OPTModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Workspace deleting"
        footer={[
          <Button key="modal_cancel" theme='simple' onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="modal_save" theme='danger' onClick={onSubmit}>
            Delete
          </Button>
        ]}
      >
        <p>Are you sure you want to delete the {workspace} workspace?</p>
      </OPTModal>
    </>
  );
};

export default DeleteWorkspace;
