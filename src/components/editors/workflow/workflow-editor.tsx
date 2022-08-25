import React, { useEffect, useState, FC } from 'react';
import { Button, Progress, Snackbar } from '@equinor/eds-core-react';
import { Grid, Stack } from '@mui/material';
import { Workflow } from '../../../models/v2/workflow';
import { EditorCentralBar, Sidebar, Brick, GraphEditor, MapConfig, SecretsVolumesConfig } from '../components';
import { createGraphElements, INode, nanoid } from '../helpers';
import { Component, Conditional, Graph, IVolume, Map } from '../../../models/v2';
import { services } from '../../../services/v2';
import { isNotEmptyArray } from '../../../common';
import { ObjectEditor } from '../../object-editor/object-editor';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { IfConfig } from '../components/functional-components/if/if-config';

interface IWorkflowEditor {
  uid: string | null;
  workspace: string;
}

const WorkflowEditor: FC<IWorkflowEditor> = (props: IWorkflowEditor) => {
  const { workspace, uid } = props;
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [component, setComponent] = useState<Component | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [marketplaceSnackbar, setMarketplaceSnackbar] = useState<boolean>(false);
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();
  const [workspaceSecrets, setWorkspaceSecrets] = useState<string[]>([]);
  const [workspaceVolumes, setWorkspaceVolumes] = useState<IVolume[]>([]);

  useEffect(() => {
    console.log('component onMount');
    async function getInitialSubComponents(workflow: Workflow) {
      if (workflow) {
        const subs: Component[] = [];
        const { nodes } = workflow.component.implementation as Graph;
        if (isNotEmptyArray(nodes)) {
          await Promise.all(
            nodes.map(async (node) => {
              if (typeof node.node === 'string') {
                const res = await services.components.get(node.node);
                subs.push(res);
              }
              if ((node?.node as Component)?.implementation?.type === 'map') {
                const mapNode = ((node?.node as Component)?.implementation as Map)?.node;
                if (typeof mapNode === 'string') {
                  const res = await services.components.get(mapNode);
                  subs.push(res);
                }
              }
              if ((node?.node as Component)?.implementation?.type === 'conditional') {
                const { nodeTrue, nodeFalse } = (node?.node as Component)?.implementation as Conditional;
                if (typeof nodeTrue === 'string') {
                  const res = await services.components.get(nodeTrue);
                  subs.push(res);
                }
                if (typeof nodeFalse === 'string') {
                  const res = await services.components.get(nodeFalse);
                  subs.push(res);
                }
              }
            }),
          );
        }
        return subs;
      }
    }

    if (uid) {
      services.workflows
        .get(uid)
        .then((res) => {
          getInitialSubComponents(res)
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
  }, [workspace, uid]);

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

  function onAddComponent(component: Component, setButtonState: any) {
    setDirty(true);
    const { uid } = component;
    if (uid) {
      services.components
        .get(uid)
        .then((res) => setSubcomponents((prev) => [...(prev || []), res]))
        .then(() => {
          setButtonState('success');
          setMarketplaceSnackbar(true);
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        })
        .then(() => {
          //@ts-expect-error
          setComponent((prev: Component) => ({
            ...prev,
            implementation: {
              ...prev.implementation,
              nodes: [...((prev.implementation as Graph).nodes || []), { id: `n${nanoid(8)}`, node: uid }],
            },
          }));
        });
    }
  }

  function onWorkflowSave() {
    if (workflow && !loading) {
      setLoading(true);
      services.workflows
        .update(workflow, workflow.uid!)
        .then(() => {
          setSuccessSnackbar(true);
          setLoading(false);
          setDirty(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setErrorSnackbar(true);
        });
    }
  }

  return (
    <>
      <Snackbar open={successSnackbar} onClose={() => setSuccessSnackbar(false)}>
        Workflow was successfully updated
        <Snackbar.Action>
          <Button onClick={() => setSuccessSnackbar(false)} variant="ghost">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <Snackbar open={errorSnackbar} onClose={() => setErrorSnackbar(false)}>
        Save failed. Could not update workflow.
        <Snackbar.Action>
          <Button onClick={() => setErrorSnackbar(false)} variant="ghost" color="danger">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <Snackbar open={marketplaceSnackbar} onClose={() => setMarketplaceSnackbar(false)} placement="top">
        Component was successfully added
        <Snackbar.Action>
          <Button onClick={() => setMarketplaceSnackbar(false)} variant="ghost">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
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
        setSubcomponents={setSubcomponents}
        setMarketplaceSnackbar={setMarketplaceSnackbar}
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
                onAddComponent={onAddComponent}
                component={workflow?.component}
                subComponents={subcomponents}
                setComponent={setComponent}
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
