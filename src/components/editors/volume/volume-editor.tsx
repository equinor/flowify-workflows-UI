import React, { FC, useState } from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import { Dialog, Stack } from '@mui/material';
import { IUserVolume, IVolume } from '../../../models/v2';
import { MultiToggle, TextField, ToggleButton } from '../../ui';
import Editor from '@monaco-editor/react';
import { services } from '../../../services';

interface VolumeEditorProps {
  open: boolean;
  onClose: any;
  workspace: string;
  volume: IUserVolume;
  mode: 'edit' | 'create';
  getVolumes: any;
}

export const VolumeEditor: FC<VolumeEditorProps> = (props: VolumeEditorProps) => {
  const { open, onClose, workspace, mode, getVolumes } = props;
  const [volume, setVolume] = useState<IUserVolume>(props.volume);
  const [editorStyle, setEditorStyle] = useState<'minimal' | 'expanded' | 'json'>('minimal');

  function saveVolume() {
    if (volume) {
      // Checking if no change has happened to the volume
      if (props.volume === volume) {
        onClose();
        return;
      }
      // Updating existing volume
      if (mode === 'edit') {
        services.volumes
          .update(workspace, volume as IVolume)
          .then((res) => {
            getVolumes(workspace);
            onClose();
          })
          .catch((error) => console.error(error));
      }
      // Creating new volume
      if (mode === 'create') {
        services.volumes
          .create(workspace, volume)
          .then((res) => {
            getVolumes(workspace);
            onClose();
          })
          .catch((error) => console.error(error));
      }
    }
  }

  function onEditorChange(value: string | undefined) {
    if (value?.startsWith('{')) {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        setVolume((prev) => ({ ...prev, volume: parsed }));
      }
    }
  }

  return (
    <Dialog open={open} onClose={saveVolume} maxWidth="md" fullWidth>
      <Stack padding="2rem" height="80vh" justifyContent="space-between">
        <Stack spacing={2} style={{ flexGrow: '2' }}>
          <Typography variant="h4">{mode === 'edit' ? 'Edit' : 'Create new'} volume</Typography>
          <MultiToggle>
            <ToggleButton active={editorStyle === 'minimal'} onClick={() => setEditorStyle('minimal')}>
              Minimal configuration
            </ToggleButton>
            <ToggleButton active={editorStyle === 'expanded'} onClick={() => setEditorStyle('expanded')}>
              Advanced configuration
            </ToggleButton>
            <ToggleButton active={editorStyle === 'json'} onClick={() => setEditorStyle('json')}>
              Configure volume JSON
            </ToggleButton>
          </MultiToggle>
          {editorStyle === 'json' ? (
            <Editor
              height="100%"
              value={JSON.stringify(volume?.volume, null, '  ')}
              language="json"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: true,
                wordWrap: 'on',
              }}
              onChange={(value) => onEditorChange(value)}
            />
          ) : (
            <>
              {editorStyle === 'expanded' && (
                <>
                  <TextField
                    id="volume_name"
                    label="Volume name"
                    defaultValue={volume?.volume?.name}
                    onBlur={(event: any) =>
                      setVolume((prev: IUserVolume) => ({
                        ...prev,
                        volume: {
                          ...prev?.volume,
                          name: event.target.value,
                        },
                      }))
                    }
                  />
                  <TextField
                    id="volume_name"
                    label="Driver"
                    defaultValue={volume?.volume?.csi?.driver}
                    onBlur={(event: any) =>
                      setVolume((prev: IUserVolume) => ({
                        ...prev,
                        volume: {
                          ...prev?.volume,
                          csi: {
                            ...prev?.volume?.csi,
                            driver: event.target.value,
                          },
                        },
                      }))
                    }
                  />
                </>
              )}
              <TextField
                id="volume_name"
                label="Container name"
                defaultValue={volume?.volume?.csi?.volumeAttributes?.containerName}
                onBlur={(event: any) =>
                  setVolume((prev: IUserVolume) => ({
                    ...prev,
                    volume: {
                      ...prev?.volume,
                      csi: {
                        ...prev?.volume?.csi,
                        volumeAttributes: {
                          ...prev?.volume?.csi?.volumeAttributes,
                          containerName: event.target.value,
                        },
                      },
                    },
                  }))
                }
              />
              {editorStyle === 'expanded' && (
                <>
                  <TextField
                    id="volume_name"
                    label="Mount options"
                    defaultValue={volume?.volume?.csi?.volumeAttributes?.mountOptions}
                    onBlur={(event: any) =>
                      setVolume((prev: IUserVolume) => ({
                        ...prev,
                        volume: {
                          ...prev?.volume,
                          csi: {
                            ...prev?.volume?.csi,
                            volumeAttributes: {
                              ...prev?.volume?.csi?.volumeAttributes,
                              mountOptions: event.target.value,
                            },
                          },
                        },
                      }))
                    }
                  />
                  <TextField
                    id="volume_name"
                    label="Secret name"
                    defaultValue={volume?.volume?.csi?.volumeAttributes?.secretName}
                    onBlur={(event: any) =>
                      setVolume((prev: IUserVolume) => ({
                        ...prev,
                        volume: {
                          ...prev?.volume,
                          csi: {
                            ...prev?.volume?.csi,
                            volumeAttributes: {
                              ...prev?.volume?.csi?.volumeAttributes,
                              secretName: event.target.value,
                            },
                          },
                        },
                      }))
                    }
                  />
                </>
              )}
            </>
          )}
        </Stack>
        <Stack alignItems="flex-end">
          <Button onClick={saveVolume}>Save volume</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
