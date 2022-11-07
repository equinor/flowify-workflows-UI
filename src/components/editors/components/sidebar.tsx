import React, { FC, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { isNotEmptyArray } from '@common';
import { Component, Workflow } from '@models/v2';
import { BaseInput } from '@form';
import { MultiToggle, ToggleButton, Button, Chip, Message, DialogWrapper, Stack, Modal } from '@ui';
import { nanoid } from '../helpers';
import { StyledTextButton } from './document-editor/styles';
import { Parameter, EditorHeader } from '.';

interface SidebarProps {
  component: Component | null | undefined;
  document: Workflow | Component | undefined;
  setComponent: any;
  setDocument: any;
  workspace: string;
  secrets?: string[];
  isLatest?: boolean;
}

type ImplementationTypes = 'any' | 'brick' | 'graph';

export const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
  const { component, setComponent, workspace, setDocument, document, secrets } = props;
  const [editName, setEditName] = useState<boolean>(false);
  const [confirmTypeChange, setConfirmTypeChange] = useState<ImplementationTypes | undefined>(undefined);

  console.log('sidebar render');

  const inputs = component?.inputs?.filter((input) => input.type !== 'env_secret' && input.type !== 'volume');
  const outputs = component?.outputs?.filter((input) => input.type !== 'env_secret' && input.type !== 'volume');
  const inputSecrets = component?.inputs?.filter((input) => input.type === 'env_secret');
  const inputVolumes = component?.inputs?.filter((input) => input.type === 'volume');

  const inputNames: string[] = component?.inputs?.map((input) => input.name || '') || [];
  const outputNames: string[] = component?.outputs?.map((output) => output.name || '') || [];

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

  function setImplementationType(type: 'any' | 'brick' | 'graph' | undefined) {
    const implementation = type === 'brick' ? { type, container: {} } : { type };
    setConfirmTypeChange(undefined);
    setComponent((prev: Component) => ({
      ...prev,
      implementation,
    }));
  }

  function onTypeChange(type: 'any' | 'brick' | 'graph') {
    if (component?.implementation?.type === 'brick' || component?.implementation?.type === 'graph') {
      setConfirmTypeChange(type);
      return;
    }
    setImplementationType(type);
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
    <Stack spacing={2} padding={1} style={{ position: 'relative', width: '100%' }}>
      <Modal maxWidth="sm" open={confirmTypeChange !== undefined} onClose={() => setConfirmTypeChange(undefined)}>
        <DialogWrapper padding={2} spacing={2}>
          <Typography variant="body_short">
            Are you sure you want to change implementation type?{' '}
            {component?.implementation?.type === 'brick'
              ? 'This will delete any values you have entered to the container, commands, args and results.'
              : 'This will delete any items you have added to your graph and their connections.'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button theme="simple" onClick={() => setConfirmTypeChange(undefined)}>
              Cancel
            </Button>
            <Button onClick={() => setImplementationType(confirmTypeChange)}>Confirm</Button>
          </Stack>
        </DialogWrapper>
      </Modal>
      <EditorHeader
        type={document?.type === 'component' ? 'Component' : 'Workflow'}
        workspace={workspace}
      ></EditorHeader>
      <Stack spacing={0.5}>
        {editName ? (
          <BaseInput
            name="document_name"
            autoFocus
            defaultValue={document?.name}
            onBlur={(event) => updateName(event)}
          />
        ) : (
          <StyledTextButton onClick={() => setEditName(true)}>
            <Typography variant="h3">{document?.name}</Typography>
          </StyledTextButton>
        )}
        <div>
          <Chip>v{document?.version?.current || ''}</Chip>
        </div>
      </Stack>
      <Stack spacing={0.5}>
        <MultiToggle label="Implementation type" labelVariant="h5">
          <ToggleButton active={component?.implementation?.type === 'any'} onClick={() => onTypeChange('any')}>
            Any
          </ToggleButton>
          {document?.type === 'component' ? (
            <ToggleButton active={component?.implementation?.type === 'brick'} onClick={() => onTypeChange('brick')}>
              Brick
            </ToggleButton>
          ) : null}
          <ToggleButton active={component?.implementation?.type === 'graph'} onClick={() => onTypeChange('graph')}>
            Graph
          </ToggleButton>
        </MultiToggle>
        {component?.implementation?.type === 'any' && (
          <Message theme="warning" icon="warning_outlined">
            <Typography variant="body_short">
              Select implementation type "graph" or "brick" to start building your {document?.type}.
            </Typography>
          </Message>
        )}
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="h5">Inputs</Typography>
        {isNotEmptyArray(inputs) ? (
          inputs?.map((input, index) => (
            <Parameter
              key={`${input?.name}_${index}`}
              parameter={input}
              index={component?.inputs?.findIndex((param) => param.name === input?.name) || 0}
              setComponent={setComponent}
              type="input"
              editableValue={document?.type === 'workflow'}
              secrets={secrets}
              names={inputNames}
            />
          ))
        ) : (
          <Typography variant="body_short">No inputs exists for this {document?.type}</Typography>
        )}
        <Button onClick={() => addParameter('inputs', 'parameter')} theme="simple" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add input
        </Button>
      </Stack>
      {document?.type === 'component' && (
        <>
          <Stack spacing={0.5}>
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
                  names={inputNames}
                />
              ))
            ) : (
              <Typography variant="body_short">No secrets exists for this {document?.type}</Typography>
            )}
            <Button
              onClick={() => addParameter('inputs', 'env_secret')}
              theme="simple"
              style={{ alignSelf: 'flex-end' }}
            >
              <Icon name="add" /> Add secret
            </Button>
          </Stack>

          <Stack spacing={0.5}>
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
                  names={inputNames}
                />
              ))
            ) : (
              <Typography variant="body_short">No volumes exists for this {document?.type}</Typography>
            )}
            <Button onClick={() => addParameter('inputs', 'volume')} theme="simple" style={{ alignSelf: 'flex-end' }}>
              <Icon name="add" /> Add volume
            </Button>
          </Stack>
        </>
      )}
      <Stack spacing={0.5} style={{ paddingBottom: '2rem' }}>
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
              names={outputNames}
            />
          ))
        ) : (
          <Typography variant="body_short">No outputs exists for this {document?.type}</Typography>
        )}
        <Button onClick={() => addParameter('outputs', 'parameter')} theme="simple" style={{ alignSelf: 'flex-end' }}>
          <Icon name="add" /> Add output
        </Button>
      </Stack>
    </Stack>
  );
};
