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
  uid: string | null;
  workspace: string;
}

/**
 * Component Editor: containing
 * @param props
 * @returns
 */
const Editor: React.FC<IEditor> = (props: IEditor) => {
  const { uid, workspace } = props;
  const { version } = useParams();
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [component, setComponent] = useState<Component | undefined>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [feedback, setFeedback] = useState<FeedbackTypes>();
  const [loading, setLoading] = useState<boolean>(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [useManifest, setUseManifest] = useState<boolean>(false);

  useEffect(() => {
    console.log('component on mount');
    if (uid) {
      services.components
        .get(uid, version)
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
  }, [workspace, uid, version]);

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
        mapConfigComponent={configComponent?.id}
        open={configComponent !== undefined && configComponent?.type === 'map'}
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
        type="component"
      />
      <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Grid item xs={3} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
          <Sidebar
            component={component}
            setComponent={setComponent}
            setInstance={setComponent}
            type="component"
            workspace={workspace}
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
                component={component}
                setComponent={setComponent}
                setFeedback={setFeedback}
                setSubcomponents={setSubcomponents}
                setUseManifest={setUseManifest}
                subComponents={subcomponents}
                type={component?.implementation?.type}
              />
              {useManifest ? (
                <ObjectEditor value={component} onChange={(comp: Component) => editsOnChange(comp)} onSave={onSave} />
              ) : component?.implementation?.type === 'graph' ? (
                <GraphEditor
                  component={component}
                  dirty={dirty}
                  edges={edges}
                  mapModalOpen={configComponent !== undefined}
                  nodes={nodes}
                  onChange={editsOnChange}
                  onEdgesChange={onEdgesChange}
                  onNodesChange={onNodesChange}
                  onSave={onSave}
                  subcomponents={subcomponents}
                />
              ) : (
                <Brick component={component} onSave={onSave} setComponent={setComponent} />
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Editor;
