import React, { FC, useState } from 'react';
import { Icon, Progress, Snackbar } from '@equinor/eds-core-react';
import { Card, Dialog, DialogTitle, Stack } from '@mui/material';
import { ObjectEditor } from '../object-editor/object-editor';
import { Workflow } from '../../models/v2/workflow';
import { services } from '../../services/v2';
import { useNavigate } from 'react-router';
import { Button } from '../ui';

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
  const [workflow, setWorkflow] = useState<Workflow>(makeWorkflow(workspace));
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);

  const navigate = useNavigate();

  function onCreate() {
    if (posting) {
      return;
    }
    setPosting(true);
    if (workflow) {
      services.workflows
        .create(workflow)
        .then((res) => {
          const { uid } = res;
          if (uid) {
            navigate(`/workspace/${workspace}/workflow/${uid}`);
          }
        })
        .catch((error) => {
          console.error(error);
          setPosting(false);
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
        <DialogTitle>Create new workflow</DialogTitle>
        <Card sx={{ margin: '1rem', height: '50vh' }}>
          <ObjectEditor value={workflow} lang="yaml" onChange={(w: Workflow) => setWorkflow(w)} />
        </Card>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ padding: '1rem' }}>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button theme="create" onClick={onCreate}>
            {posting ? (
              <>
                <Progress.Circular color="neutral" size={16} /> Creating workflow…
              </>
            ) : (
              'Create workflow'
            )}
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
};

export default CreateWorkflow;
