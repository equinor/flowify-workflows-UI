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
import { VersionBar } from '../components/version-bar/version-bar';

interface IWorkflowEditor {
  uid: string | null;
  workspace: string;
}

const WorkflowEditor: FC<IWorkflowEditor> = (props: IWorkflowEditor) => {
  const { workspace, uid } = props;
  const { version } = useParams();
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [component, setComponent] = useState<Component | undefined>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [feedback, setFeedback] = useState<FeedbackTypes>();
  const [loading, setLoading] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [workspaceSecrets, setWorkspaceSecrets] = useState<string[]>([]);
  const [workspaceVolumes, setWorkspaceVolumes] = useState<IVolume[]>([]);
  const isLatest = workflow?.version?.tags?.includes('latest');

  useEffect(() => {
    console.log('component onMount');
    if (uid) {
      services.workflows
        .get(uid, version)
        .then((res) => {
          if (res?.component) {
            fetchInitialSubComponents(res?.component).then((subs) => {
              setSubcomponents(subs);
              setComponent(res.component);
              setWorkflow(res);
            });
          }
        })
        .catch((error) => console.error(error));
    }

    // Fetch workspace secrets to use for selection of secrets in nodes/components
    services.secrets
      .list(workspace!)
      .then((res) => {
        setWorkspaceSecrets(res.items);
      })
      .catch((error) => console.error(error));

    // Fetch workspace volumes to use for selection of volumes in nodes/components
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
      setWorkflow((prev) => ({
        ...prev,
        component: component,
      }));
    }
  }, [component]);

  function onSave() {
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

  function onPublish() {
    if (workflow && !loading) {
      setLoading(true);
      services.workflows
        .publish(workflow, workflow.uid!)
        .then((res) => {
          console.log(res);
          // TODO: Reroute to new workflow
        })
        .catch((error) => {
          console.log(error);
          // TODO: Handle error
        });
    }
  }

  return (
    <>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} type="workflow" />
      <MapConfig
        component={component}
        mapConfigComponent={configComponent?.id}
        open={configComponent !== undefined && configComponent?.type === 'map'}
        setComponent={setComponent}
        setOpen={() => setConfigComponent(undefined)}
        subcomponents={subcomponents}
      />
      <IfConfig
        component={component}
        ifConfigComponent={configComponent?.id}
        open={configComponent !== undefined && configComponent?.type === 'if'}
        setComponent={setComponent}
        setOpen={() => setConfigComponent(undefined)}
        subcomponents={subcomponents}
      />
      <SecretsVolumesConfig
        component={component}
        parameterConfig={parameterConfig}
        setComponent={setComponent}
        setParameterConfig={setParameterConfig}
        subcomponents={subcomponents}
        type="workflow"
        workspace={workspace}
        workspaceSecrets={workspaceSecrets}
        workspaceVolumes={workspaceVolumes}
      />
      <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Grid item xs={3} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
          <Sidebar
            component={component}
            secrets={workspaceSecrets}
            setComponent={setComponent}
            setInstance={setWorkflow}
            type="workflow"
            workflow={workflow}
            workspace={workspace}
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
                component={workflow?.component}
                setComponent={setComponent}
                setFeedback={setFeedback}
                setSubcomponents={setSubcomponents}
                setUseManifest={setUseManifest}
                subComponents={subcomponents}
                type={workflow?.component?.implementation?.type}
              />
              <Stack sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}>
                <VersionBar
                  type="workflow"
                  version={workflow?.version?.current}
                  isLatest={isLatest || false}
                  onSave={onSave}
                  onPublish={onPublish}
                />
                {useManifest ? (
                  <ObjectEditor
                    onChange={(wf: Workflow) => {
                      setWorkflow(wf);
                      setComponent(wf.component);
                      setDirty(true);
                    }}
                    value={workflow}
                  />
                ) : workflow?.component?.implementation?.type === 'graph' ? (
                  <GraphEditor
                    component={component || null}
                    dirty={dirty}
                    edges={edges}
                    mapModalOpen={configComponent !== undefined}
                    nodes={nodes}
                    onChange={setComponent}
                    onEdgesChange={onEdgesChange}
                    onNodesChange={onNodesChange}
                    subcomponents={subcomponents}
                  />
                ) : (
                  <Brick component={component} setComponent={setComponent} />
                )}
              </Stack>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default WorkflowEditor;
