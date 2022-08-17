import React, { FC, useState } from 'react';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { Checkbox, Dialog, ListItemText, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import Editor from '@monaco-editor/react';
import { Storage } from '@mui/icons-material';
import { Arg, Brick, Component, Data, DataTypes, Edge, Graph, Port, Result } from '../../../models/v2';
import { isNotEmptyArray } from '../../../common';
import { DraggableList } from './draggable-list/draggable-list';

interface ParameterProps {
  parameter: Data;
  index: number;
  setComponent: any;
  type: 'input' | 'output';
  secrets?: string[];
  editableValue?: boolean;
  onlyEditableValue?: boolean;
  secret?: boolean;
  volume?: boolean;
}

const ParameterWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  column-gap: 1rem;
  padding: 0.75rem;
  background-color: #ade2e619;
  border: none;
  //border-left: 3px solid #007079;
  border-radius: 1rem;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 112, 121, 0.2);
  }
`;

const TYPE_ICONS = {
  parameter: 'swap_horizontal',
  artifact: 'file',
  env_secret: 'security',
  parameter_array: 'list',
};

const MEDIATYPES = ['string', 'integer', 'env_variable'];

const TYPES: DataTypes[] = ['parameter', 'artifact', 'parameter_array'];

export const Parameter: FC<ParameterProps> = (props: ParameterProps) => {
  const { index, setComponent, type, secrets, onlyEditableValue, editableValue, secret, volume } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [parameter, setParameter] = useState<Data>(props.parameter);

  const parameterType = type === 'input' ? 'inputs' : 'outputs';
  const parameterMappings = type === 'input' ? 'inputMappings' : 'outputMappings';

  function getMediaType(value: string, mediatypes: string[]) {
    if (value === 'parameter' || value === 'parameter_array') {
      return mediatypes;
    }
    if (value === 'env_secret') {
      return ['env_secret'];
    }
    if (value === 'artifact') {
      return ['file'];
    }
    if (value === 'volume') {
      return ['volume'];
    }
    return [];
  }

  function updateParameter(list?: Data[]) {
    if (!list) {
      return [];
    }
    list[index] = {
      ...parameter,
      mediatype: getMediaType(parameter.type, parameter.mediatype),
    };
    return list;
  }

  function updateArgs(args: Arg[]) {
    if (isNotEmptyArray(args) && type === 'input') {
      const updated = args.map((arg) =>
        (arg?.source as Port)?.port === props.parameter?.name
          ? { ...arg, source: { port: parameter.name }, target: { ...arg.target, type: parameter.type } }
          : arg,
      );
      return updated;
    }
    return args;
  }

  function updateResults(results: Result[] | undefined) {
    if (isNotEmptyArray(results) && type === 'output') {
      const updated = results!.map((result) =>
        result?.target?.port === props.parameter?.name
          ? { ...result, target: { ...result?.target, port: parameter?.name } }
          : result,
      );
      return updated;
    }
    return results;
  }

  async function onClose() {
    setComponent((prev: Component) =>
      prev?.implementation?.type === 'brick'
        ? {
            ...prev,
            implementation: {
              ...prev?.implementation,
              [parameterMappings]: (prev.implementation as Graph)[parameterMappings]?.map((mapping: Edge) =>
                mapping.source.port !== props.parameter.name
                  ? mapping
                  : { ...mapping, source: { port: parameter.name } },
              ),
              [parameterType]: updateParameter(prev[parameterType]),
              args: updateArgs((prev?.implementation as Brick)?.args),
              results: updateResults((prev?.implementation as Brick)?.results),
            },
          }
        : {
            ...prev,
            implementation: {
              ...prev.implementation,
              [parameterMappings]: (prev.implementation as Graph)[parameterMappings]?.map((mapping: Edge) =>
                mapping.source.port !== props.parameter.name
                  ? mapping
                  : { ...mapping, source: { port: parameter.name } },
              ),
            },
            [parameterType]: updateParameter(prev[parameterType]),
          },
    );
    setOpen(false);
  }

  function removeInput() {
    setComponent((prev: Component) => ({
      ...prev,
      [parameterType]: [
        ...prev[parameterType]!.slice(0, index),
        ...prev[parameterType]!.slice(index + 1, prev[parameterType]!.length),
      ],
      implementation: {
        ...prev.implementation,
        [parameterMappings]: (prev.implementation as Graph)?.[parameterMappings]?.filter((mapping: Edge) =>
          parameterMappings === 'inputMappings'
            ? mapping?.source?.port !== props.parameter?.name
            : mapping?.target?.port !== props?.parameter?.name,
        ),
      },
    }));
  }

  function addArrayValue() {
    function addOrCreateValue(value: string | string[] | undefined): string | string[] {
      if (Array.isArray(value)) {
        value.push('');
        return value;
      }
      return [''];
    }

    setParameter((prev: Data) => ({
      ...prev,
      userdata: {
        ...prev.userdata,
        value: addOrCreateValue(prev.userdata?.value),
      },
    }));
  }

  function arrayValueOnBlur(event: any, index: number) {
    function updateValue(value: string[]) {
      value[index] = event.target.value;
      return value;
    }
    setParameter((prev: Data) => ({
      ...prev,
      userdata: {
        ...prev.userdata,
        value: updateValue(prev.userdata!.value as string[]),
      },
    }));
  }

  return (
    <>
      <Stack spacing={0.5}>
        <ParameterWrapper onClick={() => setOpen(true)}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {parameter?.type === 'volume' ? (
              <Storage sx={{ color: '#007079' }} />
            ) : (
              <Icon color="#007079" name={TYPE_ICONS[parameter.type as keyof typeof TYPE_ICONS]} />
            )}
            <div style={{ flexGrow: '2' }}>
              <Typography variant="h5">{parameter.name}</Typography>
              <Typography variant="body_short">{parameter.userdata?.description}</Typography>
              {editableValue && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ paddingLeft: '0.25rem', paddingTop: '0.25rem' }}
                >
                  <Icon name="subdirectory_arrow_right" color="#007079" size={16} />
                  <Typography variant="caption">
                    {Array.isArray(parameter?.userdata?.value)
                      ? parameter?.userdata?.value.join(', ')
                      : parameter?.userdata?.value || 'undefined'}
                  </Typography>
                </Stack>
              )}
            </div>
          </Stack>
        </ParameterWrapper>
      </Stack>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <Stack sx={{ padding: '2rem' }} spacing={2}>
          <Typography variant="h5">Edit input</Typography>
          <div>
            <Typography variant="h6">Name</Typography>
            <TextField
              name="input_name"
              fullWidth
              defaultValue={parameter?.name}
              onBlur={(event) =>
                setParameter((prev: Data) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              disabled={onlyEditableValue}
            />
          </div>
          {props.editableValue && (
            <div>
              <Typography variant="h6">Value</Typography>
              {parameter.type === 'env_secret' ? (
                <Select
                  id={`input-secret-selector`}
                  value={parameter?.userdata?.value || ''}
                  onChange={(event) =>
                    setParameter((prev: Data) => ({
                      ...prev,
                      userdata: {
                        ...prev.userdata,
                        value: event.target.value,
                      },
                    }))
                  }
                  placeholder="Select workspace secret"
                  input={<OutlinedInput />}
                  fullWidth
                >
                  {isNotEmptyArray(secrets) &&
                    secrets!.map((secret) => (
                      <MenuItem key={secret} value={secret}>
                        <ListItemText primary={secret} />
                      </MenuItem>
                    ))}
                </Select>
              ) : parameter.type === 'volume' ? (
                <Editor
                  height="200px"
                  value={parameter?.userdata?.value as string}
                  language="json"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: true,
                    wordWrap: 'on',
                  }}
                  onChange={(value) =>
                    setParameter((prev: Data) => ({
                      ...prev,
                      userdata: {
                        ...prev.userdata,
                        value: value,
                      },
                    }))
                  }
                />
              ) : parameter.type === 'parameter_array' ? (
                <div>
                  <DraggableList
                    label=""
                    type="value"
                    onChange={(value: string[]) =>
                      setParameter((prev: Data) => ({
                        ...prev,
                        userdata: {
                          ...prev.userdata,
                          value,
                        },
                      }))
                    }
                    list={Array.isArray(parameter?.userdata?.value) ? parameter?.userdata?.value : []}
                    addItem={() => addArrayValue()}
                    child={(item, index) => (
                      <TextField fullWidth defaultValue={item} onBlur={(event) => arrayValueOnBlur(event, index)} />
                    )}
                  />
                </div>
              ) : (
                <TextField
                  name="input_value"
                  fullWidth
                  defaultValue={parameter?.userdata?.value}
                  onBlur={(event) =>
                    setParameter((prev: Data) => ({
                      ...prev,
                      userdata: {
                        ...prev.userdata,
                        value: event.target.value,
                      },
                    }))
                  }
                />
              )}
            </div>
          )}
          <div>
            <Typography variant="h6">Description</Typography>
            <TextField
              multiline
              rows={3}
              name="input_description"
              fullWidth
              defaultValue={parameter.userdata?.description}
              onBlur={(event) =>
                setParameter((prev: Data) => ({
                  ...prev,
                  userdata: {
                    ...prev.userdata,
                    description: event.target.value,
                  },
                }))
              }
              disabled={onlyEditableValue}
            />
          </div>
          <div>
            <Typography variant="h6">Type</Typography>
            <Select
              id="input-type"
              defaultValue={parameter.type}
              label="Type"
              onChange={(event) =>
                setParameter((prev: Data) => ({
                  ...prev,
                  type: event.target.value as DataTypes,
                }))
              }
              placeholder="Select type"
              fullWidth
              disabled={onlyEditableValue}
            >
              {secret ? (
                <MenuItem value="env_secret">env_secret</MenuItem>
              ) : volume ? (
                <MenuItem value="volume">volume</MenuItem>
              ) : (
                TYPES.map((type: DataTypes) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))
              )}
            </Select>
          </div>
          {parameter.type === 'parameter' ||
            (parameter.type === 'parameter_array' && (
              <div>
                <Typography variant="h6">Mediatype</Typography>
                <Select
                  multiple
                  id="input-mediatype"
                  value={parameter.mediatype || []}
                  label="Mediatype"
                  onChange={(event) =>
                    setParameter((prev: Data) => ({
                      ...prev,
                      mediatype: event.target.value as string[],
                    }))
                  }
                  placeholder="Select mediatype"
                  input={<OutlinedInput label="Mediatype" />}
                  renderValue={(selected: any) => selected.join(', ')}
                  fullWidth
                  disabled={onlyEditableValue}
                >
                  {MEDIATYPES.map((type: string) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={parameter.mediatype?.indexOf(type) > -1} />
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ))}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {!onlyEditableValue ? (
              <Button color="danger" variant="outlined" onClick={() => removeInput()}>
                <Icon name="delete_forever" /> Delete
              </Button>
            ) : (
              <div />
            )}
            <Button color="secondary" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};
