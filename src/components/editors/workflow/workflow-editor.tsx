import React, { useEffect, useState, FC } from 'react';
import { Progress } from '@equinor/eds-core-react';
import { Grid, Stack } from '@mui/material';
import { Workflow } from '../../../models/v2/workflow';
import {
  EditorCentralBar,
  Sidebar,
  Brick,
  GraphEditor,
  MapConfig,
  SecretsVolumesConfig,
  FeedbackTypes,
  Feedbacks,
} from '../components';
import { createGraphElements, fetchInitialSubComponents, INode } from '../helpers';
import { Component, IVolume } from '../../../models/v2';
import { services } from '../../../services/v2';
import { ObjectEditor } from '../../object-editor/object-editor';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { IfConfig } from '../components/functional-components/if/if-config';
import { useParams } from 'react-router';

interface IWorkflowEditor {
  uid: string | null;
  workspace: string;
}

const WorkflowEditor: FC<IWorkflowEditor> = (props: IWorkflowEditor) => {
  const { workspace, uid } = props;
  const { version } = useParams();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [component, setComponent] = useState<Component | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackTypes>();
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();
  const [workspaceSecrets, setWorkspaceSecrets] = useState<string[]>([]);
  const [workspaceVolumes, setWorkspaceVolumes] = useState<IVolume[]>([]);

  useEffect(() => {
    console.log('component onMount');

    if (uid) {
      services.workflows
        .get(uid, version)
        .then((res) => {
          fetchInitialSubComponents(res?.component)
            .then((subs) => {
              setSubcomponents(subs);
            })
            .then(() => {
              setComponent(res.component);
              setWorkflow(res);
            });
        })
        .catch((error) => console.error(error));
    }

    services.secrets
      .list(workspace!)
      .then((res) => {
        setWorkspaceSecrets(res.items);
      })
      .catch((error) => console.error(error));

    services.volumes.list(workspace!).then((res) => {
      setWorkspaceVolumes(res.items);
    });
  }, [workspace, uid, version]);

  useEffect(() => {
    if (workflow) {
      console.log('on workflow update');
      const awaitElements = async () => {
        return await createGraphElements(workflow?.component, subcomponents, setParameterConfig, setConfigComponent);
      };
      awaitElements().then((res) => {
        setNodes(res.nodes);
        setEdges(res.edges);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  useEffect(() => {
    if (component) {
      console.log('component updates workflow');
      //@ts-expect-error
      setWorkflow((prev: Workflow) => ({
        ...prev,
        component: component,
      }));
    }
  }, [component]);

  function onWorkflowSave() {
    if (workflow && !loading) {
      setLoading(true);
      services.workflows
        .update(workflow, workflow.uid!)
        .then(() => {
          setFeedback('SAVE_SUCCESS');
          setLoading(false);
          setDirty(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setFeedback('UPDATE_ERROR');
        });
    }
  }

  return (
    <>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} type="workflow" />
      <MapConfig
        component={component}
        subcomponents={subcomponents}
        setComponent={setComponent}
        mapConfigComponent={configComponent?.id}
        open={configComponent !== undefined && configComponent?.type === 'map'}
        setOpen={() => setConfigComponent(undefined)}
      />
      <IfConfig
        component={component}
        subcomponents={subcomponents}
        setComponent={setComponent}
        ifConfigComponent={configComponent?.id}
        open={configComponent !== undefined && configComponent?.type === 'if'}
        setOpen={() => setConfigComponent(undefined)}
      />
      <SecretsVolumesConfig
        parameterConfig={parameterConfig}
        setParameterConfig={setParameterConfig}
        component={component}
        setComponent={setComponent}
        subcomponents={subcomponents}
        type="workflow"
        workspace={workspace}
        workspaceSecrets={workspaceSecrets}
        workspaceVolumes={workspaceVolumes}
      />
      <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Grid item xs={3} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
          <Sidebar
            type="workflow"
            workflow={workflow}
            setInstance={setWorkflow}
            workspace={workspace}
            component={component}
            setComponent={setComponent}
            secrets={workspaceSecrets}
          />
        </Grid>
        <Grid item xs={9} sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
          {loading && !workflow ? (
            <Progress.Dots color="primary" />
          ) : (
            <Stack
              direction="row"
              sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}
            >
              <EditorCentralBar
                setUseManifest={setUseManifest}
                type={workflow?.component?.implementation?.type}
                component={workflow?.component}
                subComponents={subcomponents}
                setComponent={setComponent}
                setFeedback={setFeedback}
                setSubcomponents={setSubcomponents}
              />
              {useManifest ? (
                <ObjectEditor
                  value={workflow}
                  onChange={(t: Workflow) => {
                    setWorkflow(t);
                    setComponent(t.component);
                    setDirty(true);
                  }}
                  onSave={onWorkflowSave}
                />
              ) : workflow?.component?.implementation?.type === 'graph' ? (
                <GraphEditor
                  component={component || null}
                  onChange={setComponent}
                  subcomponents={subcomponents}
                  onSave={onWorkflowSave}
                  dirty={dirty}
                  edges={edges}
                  nodes={nodes}
                  onEdgesChange={onEdgesChange}
                  onNodesChange={onNodesChange}
                  mapModalOpen={configComponent !== undefined}
                />
              ) : (
                <Brick component={component} setComponent={setComponent} onSave={onWorkflowSave} />
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default WorkflowEditor;
