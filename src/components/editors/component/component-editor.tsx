import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Progress } from '@equinor/eds-core-react';
import { Grid, Stack } from '@mui/material';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { Component } from '../../../models/v2';
import { services } from '../../../services/v2';
import {
  EditorCentralBar,
  GraphEditor,
  Sidebar,
  Brick,
  MapConfig,
  SecretsVolumesConfig,
  Feedbacks,
  FeedbackTypes,
} from '../components';
import { createGraphElements, fetchInitialSubComponents, INode } from '../helpers';
import { ObjectEditor } from '../../object-editor/object-editor';

interface IEditor {
  name: string | null;
  workspace: string;
}

const Editor: React.FC<IEditor> = (props: IEditor) => {
  const { name, workspace } = props;
  const { version } = useParams();
  const [component, setComponent] = useState<Component | undefined>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackTypes>();
  const [useManifest, setUseManifest] = useState<boolean>(false);
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();

  useEffect(() => {
    console.log('component on mount');
    if (name) {
      services.components
        .get(name, version)
        .then((res) => {
          fetchInitialSubComponents(res)
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
  }, [workspace, name, version]);

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

  function editsOnChange(comp: Component) {
    setComponent(() => ({
      ...comp,
    }));
    setDirty(true);
  }

  function onSave() {
    if (component) {
      services.components
        .update(component, component.uid!)
        .then((res) => {
          console.log(res);
          setFeedback('SAVE_SUCCESS');
        })
        .catch((error) => {
          console.error(error);
          setFeedback('UPDATE_ERROR');
        });
    }
  }

  return (
    <>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} type="component" />
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
                component={component}
                subComponents={subcomponents}
                setComponent={setComponent}
                setSubcomponents={setSubcomponents}
                setFeedback={setFeedback}
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
