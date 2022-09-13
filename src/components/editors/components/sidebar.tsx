import React, { FC, useState } from 'react';
import { Button, Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Stack, TextField } from '@mui/material';
import styled from 'styled-components';
import { isNotEmptyArray } from '../../../common';
import { nanoid } from '../helpers';
import { EditorHeader } from '../components';
import { Component, Workflow } from '../../../models/v2';
import { Parameter } from '.';
import { MultiToggle, ToggleButton } from '../../ui';

interface SidebarProps {
  component: Component | null | undefined;
  document: Workflow | Component | undefined;
  setComponent: any;
  setDocument: any;
  workspace: string;
  secrets?: string[];
  isLatest?: boolean;
}

const StyledTextButton = styled.button`
  background: none;
  border: none;
  cursor: text;
  padding: 0;
`;

export const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
  const { component, setComponent, workspace, setDocument, document, secrets } = props;
  const [editName, setEditName] = useState<boolean>(false);

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
          name: `p${nanoid(6)}`,
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
    setDocument((prev: Component | Workflow) => ({
      ...prev,
      name: value,
    }));
    setEditName(false);
  }

  return (
    <Stack spacing={2} sx={{ padding: '1rem', position: 'relative', width: '100%' }}>
      <EditorHeader
        type={document?.type === 'component' ? 'Component' : 'Workflow'}
        workspace={workspace}
      ></EditorHeader>
      <Stack spacing={1}>
        {editName ? (
          <TextField autoFocus defaultValue={document?.name} onBlur={(event) => updateName(event)} />
        ) : (
          <StyledTextButton onClick={() => setEditName(true)}>
            <Typography variant="h3">{document?.name}</Typography>
          </StyledTextButton>
        )}
        <Chip style={{ fontSize: '1rem' }}>v{document?.version?.current || ''}</Chip>
      </Stack>
      <Stack spacing={1}>
        <MultiToggle label="Implementation type" labelVariant="h5">
          <ToggleButton active={component?.implementation?.type === 'any'} onClick={() => setImplementationType('any')}>
            Any
          </ToggleButton>
          {document?.type === 'component' ? (
            <ToggleButton
              active={component?.implementation?.type === 'brick'}
              onClick={() => setImplementationType('brick')}
            >
              Brick
            </ToggleButton>
          ) : null}
          <ToggleButton
            active={component?.implementation?.type === 'graph'}
            onClick={() => setImplementationType('graph')}
          >
            Graph
          </ToggleButton>
        </MultiToggle>
        {component?.implementation?.type === 'any' && (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ background: '#FFE7D6', padding: '1rem' }}>
            <Icon name="warning_outlined" color="#AD6200" size={32} />
            <Typography variant="body_short">
              Select implementation type "graph" or "brick" to start building your {document?.type}.
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
              editableValue={document?.type === 'workflow'}
              secrets={secrets}
            />
          ))
        ) : (
          <Typography variant="body_short">No inputs exists for this {document?.type}</Typography>
        )}
        <Button onClick={() => addParameter('inputs', 'parameter')} variant="ghost" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add input
        </Button>
      </Stack>
      {document?.type === 'component' && (
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
              <Typography variant="body_short">No secrets exists for this {document?.type}</Typography>
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
              <Typography variant="body_short">No volumes exists for this {document?.type}</Typography>
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
              editableValue={document?.type === 'workflow'}
            />
          ))
        ) : (
          <Typography variant="body_short">No outputs exists for this {document?.type}</Typography>
        )}
        <Button onClick={() => addParameter('outputs', 'parameter')} variant="ghost" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add output
        </Button>
      </Stack>
    </Stack>
  );
};
