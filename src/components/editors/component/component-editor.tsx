import React, { useEffect, useState } from 'react';
import { Button, Progress, Snackbar } from '@equinor/eds-core-react';
import { Grid, Stack } from '@mui/material';
import { Component, Conditional, Graph, Map } from '../../../models/v2';
import { services } from '../../../services/v2';
import { EditorCentralBar, GraphEditor, Sidebar, Brick, MapConfig, SecretsVolumesConfig } from '../components';
import { createGraphElements, INode, nanoid } from '../helpers';
import { isNotEmptyArray } from '../../../common';
import { ObjectEditor } from '../../object-editor/object-editor';
import { useEdgesState, useNodesState } from 'react-flow-renderer';

interface IEditor {
  name: string | null;
  workspace: string;
}

const Editor: React.FC<IEditor> = (props: IEditor) => {
  const { name, workspace } = props;
  const [component, setComponent] = useState<Component | undefined>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSnackbar, setSavedSnackbar] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [marketplaceSnackbar, setMarketplaceSnackbar] = useState<boolean>(false);
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();

  useEffect(() => {
    console.log('component on mount');
    async function getInitialSubComponents(component: Component) {
      if (component) {
        const subs: Component[] = [];
        const { nodes } = component.implementation as Graph;
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

    if (name) {
      services.components
        .get(name)
        .then((res) => {
          getInitialSubComponents(res)
            .then((subs) => {
              setSubcomponents(subs);
            })
            .then(() => {
              setComponent(res);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [workspace, name]);

  useEffect(() => {
    if (component) {
      console.log('on component update');
      const awaitElements = async () => {
        return await createGraphElements(component, subcomponents, setParameterConfig, setConfigComponent);
      };
      awaitElements().then((res) => {
        setNodes(res.nodes);
        setEdges(res.edges);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  const editsOnChange = (comp: Component) => {
    setComponent(() => ({
      ...comp,
    }));
    setDirty(true);
  };

  const onSave = () => {
    if (component) {
      services.components
        .update(component, component.uid!)
        .then((res) => {
          console.log(res);
          setSavedSnackbar(true);
        })
        .catch((error) => {
          console.error(error);
          setErrorSnackbar(true);
        });
    }
  };

  async function onAddComponent(component: Component, setButtonState: any) {
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
              nodes: [...((prev.implementation as Graph)?.nodes || []), { id: `n${nanoid(8)}`, node: uid }],
            },
          }));
        })
        .catch((error) => {
          console.error(error);
          setButtonState('error');
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        });
    }
  }

  return (
    <>
      <Snackbar open={savedSnackbar} onClose={() => setSavedSnackbar(false)} placement="top">
        Component was successfully updated
        <Snackbar.Action>
          <Button onClick={() => setSavedSnackbar(false)} variant="ghost">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <Snackbar open={errorSnackbar} onClose={() => setErrorSnackbar(false)} placement="top">
        Save failed. Could not update component.
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
      <SecretsVolumesConfig
        parameterConfig={parameterConfig}
        setParameterConfig={setParameterConfig}
        component={component}
        setComponent={setComponent}
        subcomponents={subcomponents}
        type="component"
      />
      <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Grid item xs={3} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
          <Sidebar
            workspace={workspace}
            type="component"
            component={component}
            setComponent={setComponent}
            setInstance={setComponent}
          />
        </Grid>
        <Grid item xs={9} sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
          {loading && !component ? (
            <Progress.Dots color="primary" />
          ) : (
            <Stack
              direction="row"
              sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap', height: '100%', width: '100%' }}
            >
              <EditorCentralBar
                setUseManifest={setUseManifest}
                type={component?.implementation?.type}
                onAddComponent={onAddComponent}
                component={component}
                subComponents={subcomponents}
                setComponent={setComponent}
              />
              {useManifest ? (
                <ObjectEditor value={component} onChange={(t: Component) => editsOnChange(t)} onSave={onSave} />
              ) : component?.implementation?.type === 'graph' ? (
                <GraphEditor
                  component={component}
                  onChange={editsOnChange}
                  subcomponents={subcomponents}
                  onSave={onSave}
                  dirty={dirty}
                  edges={edges}
                  nodes={nodes}
                  onEdgesChange={onEdgesChange}
                  onNodesChange={onNodesChange}
                  mapModalOpen={configComponent !== undefined}
                />
              ) : (
                <Brick component={component} setComponent={setComponent} onSave={onSave} />
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Editor;
