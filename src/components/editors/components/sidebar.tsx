import React, { FC, useState } from 'react';
import { Button, Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Stack, TextField } from '@mui/material';
import moment from 'moment';
import styled from 'styled-components';
import { isNotEmptyArray } from '../../../common';
import { nanoid } from '../helpers';
import { EditorHeader } from '../components';
import { Component, Workflow } from '../../../models/v2';
import { Parameter } from './parameter';
import { RunWorkflow } from '../../creators';

interface SidebarProps {
  type: 'workflow' | 'component';
  component: Component | null | undefined;
  workflow?: Workflow;
  setComponent: any;
  setInstance: any;
  workspace: string;
  secrets?: string[];
}

const StyledTextButton = styled.button`
  background: none;
  border: none;
  cursor: text;
  padding: 0;
`;

export const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
  const { component, setComponent, workspace, type, setInstance, workflow, secrets } = props;
  const [editName, setEditName] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<boolean>(false);

  console.log('sidebar render');

  const inputs = component?.inputs?.filter((input) => input.type !== 'env_secret' && input.type !== 'volume');
  const outputs = component?.outputs?.filter((input) => input.type !== 'env_secret' && input.type !== 'volume');
  const inputSecrets = component?.inputs?.filter((input) => input.type === 'env_secret');
  const inputVolumes = component?.inputs?.filter((input) => input.type === 'volume');

  function addParameter(type: 'inputs' | 'outputs', paramType: 'parameter' | 'env_secret' | 'volume') {
    setComponent((prev: Component) => ({
      ...prev,
      [type]: [
        ...(prev[type]! || []),
        {
          name: nanoid(6),
          type: paramType,
          mediatype: ['string'],
        },
      ],
    }));
  }

  function setImplementationType(type: 'any' | 'brick' | 'graph') {
    setComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        type,
      },
    }));
  }

  function updateName(event: any) {
    const { value } = event.target;
    setInstance((prev: Component | Workflow) => ({
      ...prev,
      name: value,
    }));
    setEditName(false);
  }

  function updateDescription(event: any) {
    const { value } = event.target;
    setInstance((prev: Component | Workflow) => ({
      ...prev,
      description: value,
    }));
    setEditDescription(false);
  }

  return (
    <Stack spacing={2} sx={{ padding: '1rem', position: 'relative', width: '100%' }}>
      <EditorHeader type={type === 'component' ? 'Component' : 'Workflow'} workspace={workspace}></EditorHeader>
      <Stack spacing={1}>
        {component?.version?.current && <Chip style={{ fontSize: '1rem' }}>v{component?.version?.current}</Chip>}
        {editName ? (
          <TextField
            autoFocus
            defaultValue={type === 'component' ? component?.name : workflow?.name}
            onBlur={(event) => updateName(event)}
          />
        ) : (
          <StyledTextButton onClick={() => setEditName(true)}>
            <Typography variant="h3">{type === 'component' ? component?.name : workflow?.name}</Typography>
          </StyledTextButton>
        )}
        {editDescription ? (
          <TextField
            autoFocus
            multiline
            rows={3}
            defaultValue={type === 'component' ? component?.description : workflow?.description}
            onBlur={(event) => updateDescription(event)}
          />
        ) : (
          <StyledTextButton onClick={() => setEditDescription(true)}>
            <Typography variant="body_long">
              {(type === 'component' ? component?.description : workflow?.description) || '+ add description'}
            </Typography>
          </StyledTextButton>
        )}
      </Stack>
      <Typography variant="body_long">
        <b>Author</b> {type === 'component' ? component?.modifiedBy : workflow?.modifiedBy} <br />
        {type === 'workflow' && (
          <>
            <b>Workspace</b> {workflow?.workspace}
            <br />
          </>
        )}
        <b>Last modified</b>{' '}
        {moment(type === 'component' ? component?.timestamp : workflow?.timestamp).format('MMMM Do YYYY, H:mm:ss')}
      </Typography>
      <Stack alignItems="flex-start">{workflow && <RunWorkflow workflow={workflow} secrets={secrets} />}</Stack>
      <Stack spacing={1}>
        <Typography variant="h5">Implementation type</Typography>
        <Stack direction="row">
          <Button
            variant={component?.implementation?.type === 'any' ? undefined : 'outlined'}
            style={{ borderRight: 'none', borderRadius: '10px 0 0 10px' }}
            onClick={() => setImplementationType('any')}
          >
            Any
          </Button>
          {type === 'component' && (
            <Button
              variant={component?.implementation?.type === 'brick' ? undefined : 'outlined'}
              onClick={() => setImplementationType('brick')}
              style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}
            >
              Brick
            </Button>
          )}
          <Button
            variant={component?.implementation?.type === 'graph' ? undefined : 'outlined'}
            style={{ borderLeft: 'none', borderRadius: '0 10px 10px 0' }}
            onClick={() => setImplementationType('graph')}
          >
            Graph
          </Button>
        </Stack>
        {component?.implementation?.type === 'any' && (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ background: '#FFE7D6', padding: '1rem' }}>
            <Icon name="warning_outlined" color="#AD6200" size={32} />
            <Typography variant="body_short">
              Select implementation type "graph" or "brick" to start building your {type}.
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h5">Inputs</Typography>
        {isNotEmptyArray(inputs) ? (
          inputs?.map((input) => (
            <Parameter
              key={input?.name}
              parameter={input}
              index={component?.inputs?.findIndex((param) => param.name === input?.name) || 0}
              setComponent={setComponent}
              type="input"
              editableValue={type === 'workflow'}
              secrets={secrets}
            />
          ))
        ) : (
          <Typography variant="body_short">No inputs exists for this {type}</Typography>
        )}
        <Button onClick={() => addParameter('inputs', 'parameter')} variant="ghost" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add input
        </Button>
      </Stack>
      {type === 'component' && (
        <>
          <Stack spacing={1}>
            <Typography variant="h5">Secrets</Typography>
            {isNotEmptyArray(inputSecrets) ? (
              inputSecrets?.map((input) => (
                <Parameter
                  key={input?.name}
                  parameter={input}
                  index={component?.inputs?.findIndex((param) => param.name === input?.name) || 0}
                  setComponent={setComponent}
                  type="input"
                  editableValue={false}
                  secrets={secrets}
                  secret
                />
              ))
            ) : (
              <Typography variant="body_short">No secrets exists for this {type}</Typography>
            )}
            <Button
              onClick={() => addParameter('inputs', 'env_secret')}
              variant="ghost"
              style={{ alignSelf: 'flex-end' }}
            >
              <Icon name="add" /> Add secret
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h5">Volumes</Typography>
            {isNotEmptyArray(inputVolumes) ? (
              inputVolumes?.map((input) => (
                <Parameter
                  key={input?.name}
                  parameter={input}
                  index={component?.inputs?.findIndex((param) => param.name === input?.name) || 0}
                  setComponent={setComponent}
                  type="input"
                  editableValue={false}
                  secrets={secrets}
                  volume
                />
              ))
            ) : (
              <Typography variant="body_short">No volumes exists for this {type}</Typography>
            )}
            <Button onClick={() => addParameter('inputs', 'volume')} variant="ghost" style={{ alignSelf: 'flex-end' }}>
              <Icon name="add" /> Add volume
            </Button>
          </Stack>
        </>
      )}
      <Stack spacing={1}>
        <Typography variant="h5">Outputs</Typography>
        {isNotEmptyArray(outputs) ? (
          outputs!.map((output, index) => (
            <Parameter
              key={output?.name}
              parameter={output}
              index={index}
              setComponent={setComponent}
              type="output"
              editableValue={type === 'workflow'}
            />
          ))
        ) : (
          <Typography variant="body_short">No outputs exists for this {type}</Typography>
        )}
        <Button onClick={() => addParameter('outputs', 'parameter')} variant="ghost" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add output
        </Button>
      </Stack>
    </Stack>
  );
};
