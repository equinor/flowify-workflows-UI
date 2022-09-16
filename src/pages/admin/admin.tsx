import React, { useEffect, useState } from 'react';
import { SelectChangeEvent, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { services } from '../../services/v2';
import { Container, Layout } from '../../layout';
import { AddSecret } from '../../components';
import { ISecret, ISecretsList, IUserVolume, IVolume, Workspace, WorkspaceList } from '../../models/v2';
import { Breadcrumbs, Select, Button } from '../../components/ui';
import { VolumeEditor } from '../../components/editors/volume/volume-editor';
import { Feedbacks, FeedbackTypes } from '../../components/editors/components';

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

export const AdminPage: React.FC = (): React.ReactElement => {
  const [secrets, setSecrets] = useState<ISecretsList>();
  const [volumes, setVolumes] = useState<IVolume[]>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [editableVolume, setEditableVolume] = useState<{ volume: IUserVolume; mode: 'edit' | 'create' }>();
  const [feedback, setFeedback] = useState<FeedbackTypes>();

  function fetchSecrets(workspace: string) {
    services.secrets
      .list(workspace)
      .then((x) => setSecrets(x))
      .catch((e) => {
        console.log('call to getSecrets failed reason: ' + e);
      });
  }

  function fetchVolumes(workspace: string) {
    services.volumes
      .list(workspace)
      .then((x) => setVolumes(x.items))
      .catch((e) => {
        console.log('call to getSecrets failed reason: ' + e);
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

  function onAdd(secret: ISecret) {
    if (secret.key !== undefined && secret.value !== undefined) {
      return services.secrets
        .create(secret, selectedWorkspace)
        .then(() => {
          fetchSecrets(selectedWorkspace);
          setFeedback('SECRET_SUCCESS');
          return 'SUCCESSFUL';
        })
        .catch((_) => {
          console.log('adding secret failed');
          return 'ERROR';
        });
    }
    return 'ERROR';
  }

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

  function onWorkspaceChange(e: SelectChangeEvent) {
    const { value } = e.target as HTMLInputElement;
    setSelectedWorkspace(value);
  }

  const workspaceOptions =
    workspaces
      ?.filter((workspace) => workspace.hasAccess)
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
            id="workspace_selector"
            options={workspaceOptions}
            onChange={onWorkspaceChange}
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AddSecret addKey={onAdd} />
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
