import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { Helmet } from 'react-helmet-async';
import { Component, ComponentListRequest } from '@models/v2';
import { IFilter, IPagination, services } from '@services';
import { checkComponentValidation, isNotEmptyArray } from '@common';
import { Stack } from '@ui';
import {
  MapConfig,
  SecretsVolumesConfig,
  Feedbacks,
  EditorMenu,
  DocumentEditor,
  MainEditor,
  Feedback,
  ValidationModal,
  IValidationError,
} from '../components';
import { createGraphElements, fetchInitialSubComponents, INode } from '../helpers';

interface IEditor {
  uid: string | null;
  workspace: string;
}

/**
 * Component Editor
 */
const Editor: React.FC<IEditor> = (props: IEditor) => {
  const { uid, workspace } = props;
  const { version } = useParams();
  const navigate = useNavigate();

  // UI states
  const [activePage, setActivePage] = useState<'editor' | 'document' | 'runs'>('editor');
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // Data
  const [component, setComponent] = useState<Component | undefined>();
  const [initialComponent, setInitialComponent] = useState<Component | undefined>();
  const [versions, setVersions] = useState<ComponentListRequest>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();

  // Graph
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);

  // Config
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();

  // Validation
  const [feedback, setFeedback] = useState<Feedback>();
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>();
  const [validationModal, setValidationModal] = useState<boolean>(false);

  const fetchComponentVersions = useCallback(
    (filters: IFilter[] | undefined, pagination: IPagination | undefined, sorting: string | undefined) => {
      const searchFilter: IFilter[] = [{ name: 'uid', value: uid!, type: 'EQUALTO' }];
      services.components
        .list(filters || searchFilter, pagination, sorting || 'sort=-timestamp')
        .then((res) => setVersions(res));
    },
    [uid],
  );

  /**
   * On mount useEffect
   * Only called when component is mounted. Hook dependecies won't change unless uri changes
   * Fetches and sets to state
   *  - Main component,
   *  - Subcomponents if implementation type is graph
   *  - Component versions for component history
   */
  useEffect(() => {
    console.log('component on mount');
    if (uid) {
      services.components
        .get(uid, version)
        .then((res) => {
          fetchInitialSubComponents(res).then((subs) => {
            setSubcomponents(subs);
            setComponent(res);
            setInitialComponent(res);
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

  /**
   * Component update useEffect - called when component updates
   *  - Sets dirty state to true if component is already mounted
   *  - Creates and sets graph elements (nodes and edges)
   *  - Validates component manifest
   */
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
      onValidate();
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  /**
   * onValidate
   * Calls yup validation on manifest, sets errors to validationErrors state and returns boolean
   * @returns Promise<boolean>
   */
  async function onValidate(passedComponent?: Component): Promise<boolean> {
    const validationErrors = await checkComponentValidation(passedComponent || component, initialComponent);
    setValidationErrors(validationErrors);
    if (isNotEmptyArray(validationErrors)) {
      return true;
    }
    return false;
  }

  /**
   * onSave
   * Save component to database (only latest version). Only runs when manifest passes validation
   * @returns void
   */
  async function onSave() {
    const hasErrors = await onValidate();
    if (hasErrors) {
      return;
    }

    // TODO: Check if latest version
    if (component && !loading) {
      setLoading(true);
      services.components
        .update(component, component.uid!)
        .then((res) => {
          setComponent(res);
          setInitialComponent(res);
          setDirty(false);
          setMounted(false);
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

  /**
   * onPublish
   * Create new version in db. Only runs when manifest passes validation
   * @returns void
   */
  async function onPublish() {
    const hasErrors = await onValidate();
    if (hasErrors) {
      return;
    }
    if (component && !loading) {
      setLoading(true);
      services.components
        .publish(component, component.uid!)
        .then((res) => {
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

  /**
   * onDelete
   * Delete component from db.
   * @returns void
   */
  function onDelete() {
    if (uid && component?.version?.current) {
      services.components
        .delete(uid, component?.version?.current)
        .then(() => {
          navigate(`/components`);
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
      <ValidationModal
        open={validationModal}
        onClose={() => setValidationModal(false)}
        validationErrors={validationErrors}
        onValidate={onValidate}
        setParameterConfig={setParameterConfig}
      />
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
      <Stack direction="row" justifyContent="stretch" style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <EditorMenu
          active={activePage}
          setActive={setActivePage}
          onSave={onSave}
          dirty={dirty}
          openValidation={() => setValidationModal(true)}
          errorsLength={validationErrors?.length || 0}
        />
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
