import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Stack } from '@mui/material';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { Helmet } from 'react-helmet-async';
import { Component, ComponentListRequest } from '../../../models/v2';
import { IFilter, IPagination, services } from '../../../services';
import {
  MapConfig,
  SecretsVolumesConfig,
  Feedbacks,
  EditorMenu,
  DocumentEditor,
  MainEditor,
  Feedback,
} from '../components';
import { createGraphElements, fetchInitialSubComponents, INode } from '../helpers';

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
  const [activePage, setActivePage] = useState<'editor' | 'document' | 'runs'>('editor');
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [component, setComponent] = useState<Component | undefined>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [feedback, setFeedback] = useState<Feedback>();
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [versions, setVersions] = useState<ComponentListRequest>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const navigate = useNavigate();

  const fetchComponentVersions = useCallback(
    (filters: IFilter[] | undefined, pagination: IPagination | undefined, sorting: string | undefined) => {
      const searchFilter: IFilter[] = [{ name: 'uid', value: uid!, type: 'EQUALTO' }];
      services.components
        .list(filters || searchFilter, pagination, sorting || 'sort=-timestamp')
        .then((res) => setVersions(res));
    },
    [uid],
  );

  useEffect(() => {
    console.log('component on mount');
    if (uid) {
      services.components
        .get(uid, version)
        .then((res) => {
          fetchInitialSubComponents(res).then((subs) => {
            setSubcomponents(subs);
            setComponent(res);
            setLoading(false);
          });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
      // Fetch latest versions of workflow
      fetchComponentVersions(undefined, undefined, undefined);
    }
  }, [workspace, uid, version, fetchComponentVersions]);

  useEffect(() => {
    if (component) {
      if (mounted) {
        setDirty(true);
      }
      console.log('on component update');
      const awaitElements = async () => {
        return await createGraphElements(component, subcomponents, setParameterConfig, setConfigComponent);
      };
      awaitElements().then((res) => {
        setNodes(res.nodes);
        setEdges(res.edges);
      });
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  function onSave() {
    // TODO: Check if latest version
    if (component && !loading) {
      setLoading(true);
      services.components
        .update(component, component.uid!)
        .then((res) => {
          console.log(res);
          setLoading(false);
          setFeedback({ message: 'Component was successfully updated.', type: 'success' });
        })
        .catch((error) => {
          console.error(error);
          // HACK UNTIL WE FIX COSMOSDB ISSUES
          if (error?.code === 500) {
            setFeedback({ message: 'Component was successfully updated.', type: 'success' });
            setLoading(false);
            return;
          }
          // TODO: Handle 409 error
          setLoading(false);
          setFeedback({ message: "'Error when updating component. Changes were not saved.", type: 'error' });
        });
    }
  }

  function onPublish() {
    if (component && !loading) {
      setLoading(true);
      services.components
        .publish(component, component.uid!)
        .then((res) => {
          console.log(res);
          setLoading(false);
          // TODO: Reroute to new component
        })
        .catch((error) => {
          console.error(error);
          // HACK UNTIL WE FIX COSMOSDB ISSUES
          if (error?.code === 500) {
            setLoading(false);
            navigate(`/component/${component.uid}/${parseInt(version!, 10) + 1}`);
            return;
          }
          setFeedback({ message: 'Error: Could not create new component version.', type: 'error' });
          setLoading(false);
          // TODO: Handle error
        });
    }
  }

  function onDelete() {
    if (uid && component?.version?.current) {
      services.components
        .delete(uid, component?.version?.current)
        .then(() => {
          navigate(`/marketplace`);
        })
        .catch((error) => {
          console.error(error);
          setFeedback({ message: 'Error when deleting component.', type: 'error' });
        });
    }
  }

  if (!component) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{component?.name || ''} - Component editor - Flowify</title>
      </Helmet>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} />
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
      <Stack direction="row" justifyContent="stretch" sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <EditorMenu active={activePage} setActive={setActivePage} onSave={onSave} dirty={dirty} />
        {activePage === 'document' && (
          <DocumentEditor
            document={component}
            setInstance={setComponent}
            versionsResponse={versions}
            onPublish={onPublish}
            onDelete={onDelete}
            fetchVersions={fetchComponentVersions}
          />
        )}
        {activePage === 'editor' && (
          <MainEditor
            component={component}
            document={component}
            setComponent={setComponent}
            setDocument={setComponent}
            workspace={workspace}
            setFeedback={setFeedback}
            subcomponents={subcomponents}
            setSubcomponents={setSubcomponents}
            setDirty={setDirty}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            configComponent={configComponent}
          />
        )}
      </Stack>
    </>
  );
};

export default Editor;
