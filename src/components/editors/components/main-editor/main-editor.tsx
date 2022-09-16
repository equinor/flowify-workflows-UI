import React, { FC, useState } from 'react';
import { Grid, Stack } from '@mui/material';
import { Node } from 'react-flow-renderer';
import { Component, Workflow } from '../../../../models/v2';
import { EditorCentralBar, Sidebar, Brick, GraphEditor } from '..';
import { FeedbackTypes } from '../feedbacks/types';
import { ManifestEditor } from '../../manifest-editor/manifest-editor';
import { INode } from '../../helpers';

interface MainEditorProps {
  component: Component | undefined;
  document: Workflow | Component | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setDocument: React.Dispatch<React.SetStateAction<any | undefined>>;
  workspace: string;
  secrets?: string[];
  setFeedback: (type: FeedbackTypes) => void;
  subcomponents: Component[] | undefined;
  setSubcomponents: React.Dispatch<React.SetStateAction<Component[] | undefined>>;
  setDirty: (dirty: boolean) => void;
  nodes: Node<INode>[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  configComponent?: any;
}

export const MainEditor: FC<MainEditorProps> = (props: MainEditorProps) => {
  const { component, document, setComponent, setDocument, secrets, subcomponents, setSubcomponents, setDirty } = props;
  const [useManifest, setUseManifest] = useState<boolean>(false);

  function onManifestChange(doc: Workflow | Component) {
    setDirty(true);
    if (doc?.type === 'workflow') {
      setDocument(doc);
      setComponent(doc?.component);
      return;
    }
    setComponent(doc as Component);
  }

  return (
    <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      <Grid item xs={3} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
        <Stack direction="row" sx={{ height: '100%' }}>
          <Sidebar
            component={component}
            secrets={secrets}
            setComponent={setComponent}
            setDocument={setDocument}
            document={document}
            workspace={props.workspace}
          />
        </Stack>
      </Grid>
      <Grid item xs={9} sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Stack
          direction="row"
          sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}
        >
          <EditorCentralBar
            component={component}
            setComponent={setComponent}
            setFeedback={props.setFeedback}
            setSubcomponents={setSubcomponents}
            setUseManifest={setUseManifest}
            subComponents={subcomponents}
            type={document?.type}
            implementationType={component?.implementation?.type}
          />
          <Stack sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}>
            {/*  <VersionBar
                  type="workflow"
                  version={workflow?.version?.current}
                  isLatest={isLatest || false}
                  onSave={onSave}
                  onPublish={onPublish}
                /> */}
            {useManifest ? (
              <ManifestEditor onChange={(doc: Workflow | Component) => onManifestChange(doc)} value={document} />
            ) : component?.implementation?.type === 'graph' ? (
              <GraphEditor
                component={component || null}
                edges={props.edges}
                mapModalOpen={props.configComponent !== undefined}
                nodes={props.nodes}
                onChange={setComponent}
                onEdgesChange={props.onEdgesChange}
                onNodesChange={props.onNodesChange}
                subcomponents={subcomponents}
              />
            ) : (
              <Brick component={component} setComponent={setComponent} />
            )}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
