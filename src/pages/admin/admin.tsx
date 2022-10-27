import React, { useEffect, useState } from 'react';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { services } from '../../services';
import { Container, Layout } from '../../layout';
import { ISecret, ISecretsList, IUserVolume, IVolume, Workspace, WorkspaceList } from '../../models/v2';
import { Breadcrumbs, Button } from '../../components/ui';
import { VolumeEditor } from '../../components/editors/volume/volume-editor';
import { Feedback, Feedbacks } from '../../components/editors/components';
import { SecretEditor } from '../../components/editors/secret-editor/secret-editor';
import { Select } from '../../components/form';
import { isNotEmptyArray } from '../../common';

function CREATE_VOLUME_TEMPLATE(workspace: string) {
  return {
    workspace,
    volume: {
      name: 'csi-blob',
      csi: {
        driver: 'blob.csi.azure.com',
        volumeAttributes: {
          containerName: '',
          mountOptions: '-o allow_other --file-cache-timeout-in-seconds=120',
          secretName: 'blobfuse',
        },
      },
    },
  };
}

const SECRET_TEMPLATE = {
  key: '',
  value: '',
};

export const AdminPage: React.FC = (): React.ReactElement => {
  const [secrets, setSecrets] = useState<ISecretsList>();
  const [volumes, setVolumes] = useState<IVolume[]>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [editableVolume, setEditableVolume] = useState<{ volume: IUserVolume; mode: 'edit' | 'create' }>();
  const [editableSecret, setEditableSecret] = useState<{ secret: ISecret; mode: 'edit' | 'create' }>();
  const [feedback, setFeedback] = useState<Feedback>();

  function fetchSecrets(workspace: string) {
    services.secrets
      .list(workspace)
      .then((x) => setSecrets(x))
      .catch((e) => {
        console.log('call to fetch Secrets failed reason: ' + e);
      });
  }

  function fetchVolumes(workspace: string) {
    services.volumes
      .list(workspace)
      .then((x) => setVolumes(x.items))
      .catch((e) => {
        console.log('call to fetch Volumes failed reason: ' + e);
      });
  }

  useEffect(() => {
    if (selectedWorkspace !== '') {
      fetchSecrets(selectedWorkspace);
      fetchVolumes(selectedWorkspace);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    services.workspace
      .list()
      .then((response: WorkspaceList) => {
        setWorkspaces(response.items);
      })
      .catch((_) => {
        console.warn('Unable to read data from workspaces');
      });
  }, []);

  function onVolumeDelete(uid: string) {
    if (uid) {
      services.volumes
        .delete(selectedWorkspace, uid)
        .then(() => {
          fetchVolumes(selectedWorkspace);
        })
        .catch((error) => console.error(error));
    }
  }

  function onSecretDelete(key: string) {
    if (key) {
      services.secrets
        .delete(key, selectedWorkspace)
        .then(() => {
          fetchSecrets(selectedWorkspace);
          setFeedback({ message: `Secret ${key} was successfully deleted.`, type: 'success' });
        })
        .catch((error) => console.error(error));
    }
  }

  const workspaceOptions =
    workspaces
      ?.filter((workspace) => isNotEmptyArray(workspace.roles) && workspace?.roles?.includes('admin'))
      .map((workspace) => ({ label: workspace.name, value: workspace.name })) || [];

  return (
    <Layout>
      <Helmet>
        <title>Admin - Flowify</title>
      </Helmet>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} />
      <Container withMargins>
        <Stack spacing={4}>
          <Breadcrumbs>
            <Link to="/dashboard">Dashboard</Link>
            <span>
              <b>Admin page</b>
            </span>
          </Breadcrumbs>
          <Select
            label="Select workspace to admin"
            name="workspace_selector"
            options={workspaceOptions}
            onChange={(value) => setSelectedWorkspace(value)}
            value={selectedWorkspace}
            placeholder="Select from workspaces you have admin access to"
          />
          {selectedWorkspace && (
            <>
              <Typography variant="h4">Secrets</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Secret name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secrets?.items?.map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button onClick={() => setEditableSecret({ secret: { key: key, value: '' }, mode: 'edit' })}>
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button theme="danger" onClick={() => onSecretDelete(key)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div>
                <Button theme="create" onClick={() => setEditableSecret({ secret: SECRET_TEMPLATE, mode: 'create' })}>
                  <Icon name="add" />
                  Add new secret
                </Button>
              </div>
              {editableSecret && (
                <SecretEditor
                  open={editableSecret !== undefined}
                  onClose={() => setEditableSecret(undefined)}
                  secret={editableSecret?.secret}
                  mode={editableSecret?.mode}
                  workspace={selectedWorkspace}
                  getSecrets={fetchSecrets}
                  setFeedback={setFeedback}
                />
              )}
              <Typography variant="h4">Volumes</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Container name</TableCell>
                    <TableCell>Volume Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {volumes?.map((volume) => (
                    <TableRow key={volume?.uid}>
                      <TableCell>{volume?.volume?.csi?.volumeAttributes?.containerName}</TableCell>
                      <TableCell>{volume?.volume?.name}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button theme="simple" onClick={() => setEditableVolume({ volume: volume, mode: 'edit' })}>
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button theme="danger" onClick={() => onVolumeDelete(volume.uid)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div>
                <Button
                  theme="create"
                  onClick={() =>
                    setEditableVolume({ volume: CREATE_VOLUME_TEMPLATE(selectedWorkspace), mode: 'create' })
                  }
                >
                  <Icon name="add" />
                  Add new volume
                </Button>
              </div>
              {editableVolume && (
                <VolumeEditor
                  open={editableVolume !== undefined}
                  onClose={() => setEditableVolume(undefined)}
                  volume={editableVolume?.volume}
                  mode={editableVolume?.mode}
                  workspace={selectedWorkspace}
                  getVolumes={fetchVolumes}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};
