import React, { useEffect, useState, FC, useCallback } from 'react';
import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { Workflow } from '../../../models/v2/workflow';
import {
  MapConfig,
  SecretsVolumesConfig,
  Feedbacks,
  EditorMenu,
  DocumentEditor,
  WorkflowJobs,
  MainEditor,
  Feedback,
  ValidationModal,
  IValidationError,
} from '../components';
import { createGraphElements, fetchInitialSubComponents, INode } from '../helpers';
import { Component, IJobsListRequest, IVolume, WorkflowListRequest } from '../../../models/v2';
import { IFilter, IPagination, services } from '../../../services';
import { IfConfig } from '../components/functional-components/if/if-config';
import { isNotEmptyArray } from '../../../common';
import { checkWorkflowValidation } from '../../../common/validation/workflow-validation';

interface IWorkflowEditor {
  uid: string | null;
  workspace: string;
}

const WorkflowEditor: FC<IWorkflowEditor> = (props: IWorkflowEditor) => {
  const { workspace, uid } = props;
  const { version } = useParams();
  const navigate = useNavigate();

  // UI states
  const [activePage, setActivePage] = useState<'editor' | 'document' | 'runs'>('editor');
  const [dirty, setDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Data
  const [component, setComponent] = useState<Component | undefined>();
  const [subcomponents, setSubcomponents] = useState<Component[]>();
  const [versions, setVersions] = useState<WorkflowListRequest>();
  const [jobs, setJobs] = useState<IJobsListRequest>();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [initialWorkflow, setInitialWorkflow] = useState<Workflow | undefined>();
  const [workspaceSecrets, setWorkspaceSecrets] = useState<string[]>([]);
  const [workspaceVolumes, setWorkspaceVolumes] = useState<IVolume[]>([]);

  // Graph
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);

  // Configs
  const [configComponent, setConfigComponent] = useState<{ id: string; type: 'map' | 'if' }>();
  const [parameterConfig, setParameterConfig] = useState<{ type: 'secret' | 'volume'; id: string }>();

  // Validation
  const [feedback, setFeedback] = useState<Feedback>();
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>();
  const [validationModal, setValidationModal] = useState<boolean>(false);

  /**
   * fetchWorkflowVersions
   * Fetch latest versions of workflow
   * @returns void
   * @updates versions state
   */
  const fetchWorkflowVersions = useCallback(
    (filters: IFilter[] | undefined, pagination: IPagination | undefined, sorting: string | undefined) => {
      const searchFilter: IFilter[] = [{ name: 'uid', value: uid!, type: 'EQUALTO' }];
      services.workflows
        .list(filters || searchFilter, pagination, sorting || 'sort=-timestamp')
        .then((res) => setVersions(res));
    },
    [uid],
  );

  /**
   * fetchJobs
   * Fetch latest run jobs
   * @returns void
   * @updates jobs state
   */
  const fetchJobs = useCallback(
    (pagination: IPagination | undefined) => {
      const jobsFilter: IFilter[] = [{ name: 'workflow.uid', value: uid || '', type: 'EQUALTO' }];
      services.jobs.list(jobsFilter, pagination, 'sort=-timestamp').then((res) => setJobs(res));
    },
    [uid],
  );

  /**
   * onValidate
   * Calls yup validation on manifest, sets errors to validationErrors state and returns boolean
   * @returns Promise<boolean>
   */
  async function onValidate() {
    const validationErrors = await checkWorkflowValidation(workflow, initialWorkflow, workspaceSecrets);
    setValidationErrors(validationErrors);
    if (isNotEmptyArray(validationErrors)) {
      return true;
    }
    return false;
  }

  /**
   * On mount hook
   * Only called when workflow is mounted. Hook dependecies won't change unless uri changes
   * Fetches and sets to state
   *  - Main workflow
   *  - Sets workflow component to own state to use in combined workflow and component editor ReactComponents
   *  - Subcomponents if implementation type is graph
   *  - Component versions for component history
   *  - Latest jobs for job history
   *  - Secrets for use in editor
   *  - Volumes for use in editor
   */
  useEffect(() => {
    console.log('workflow onMount');
    if (uid) {
      services.workflows
        .get(uid, version)
        .then((res) => {
          if (res?.component) {
            fetchInitialSubComponents(res?.component).then((subs) => {
              setSubcomponents(subs);
              setComponent(res.component);
              setInitialWorkflow(res);
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

    // Fetch latest versions of workflow
    fetchWorkflowVersions(undefined, undefined, undefined);
    // Fetch jobs
    fetchJobs(undefined);
  }, [workspace, uid, version, fetchWorkflowVersions, fetchJobs]);

  /**
   * Workflow update hook - called when workflow updates
   *  - Sets dirty state to true if workflow is already mounted
   *  - Creates and sets graph elements (nodes and edges)
   *  - Validates workflow manifest
   */
  useEffect(() => {
    if (workflow) {
      console.log('on workflow update');
      if (mounted) {
        setDirty(true);
      }
      const awaitElements = async () => {
        return await createGraphElements(workflow?.component, subcomponents, setParameterConfig, setConfigComponent);
      };
      awaitElements().then((res) => {
        setNodes(res.nodes);
        setEdges(res.edges);
      });
      onValidate();
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  /**
   * Update workflow when component updates hook
   * To be able to reuse React components for both workflow and component editor, this is a workaround that allows us to pass only component and setComponent to those React components. When component updates in those editor components, we use this hook and update workflow by updating the entire component within the workflow object with the changes.
   */
  useEffect(() => {
    if (component) {
      console.log('component updates workflow');
      setWorkflow((prev) => ({
        ...prev,
        component: component,
      }));
    }
  }, [component]);

  /**
   * onSave
   * Save workflow to database (only latest version). Only runs when manifest passes validation
   * @returns void
   */
  async function onSave() {
    const hasErrors = await onValidate();
    if (hasErrors) {
      return;
    }

    if (workflow && !loading) {
      setLoading(true);
      services.workflows
        .update(workflow, workflow.uid!)
        .then((res) => {
          console.log(res);
          setFeedback({ message: 'Workflow was successfully updated', type: 'success' });
          setLoading(false);
          setDirty(false);
        })
        .catch((error) => {
          console.error(error);
          // HACK UNTIL WE FIX COSMOSDB ISSUES
          if (error?.code === 500) {
            setFeedback({ message: 'Workflow was successfully updated', type: 'success' });
            setLoading(false);
            return;
          }
          setLoading(false);
          setFeedback({ message: 'Workflow could not be updated', type: 'error' });
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

    if (workflow && !loading) {
      setLoading(true);
      services.workflows
        .publish(workflow, workflow.uid!)
        .then((res) => {
          console.log(res);
          navigate(`/workspace/${workspace}/workflow/${workflow.uid}/${parseInt(version!, 10) + 1}`);
        })
        .catch((error) => {
          console.log(error);
          // HACK UNTIL WE FIX COSMOSDB ISSUES
          if (error?.code === 500) {
            setLoading(false);
            navigate(`/workspace/${workspace}/workflow/${workflow.uid}/${parseInt(version!, 10) + 1}`);
          }
          // TODO: Handle error
        });
    }
  }

  /**
   * onDelete
   * Delete workflow from db.
   * @returns void
   */
  function onDelete() {
    if (uid && workflow?.version?.current) {
      services.workflows
        .delete(uid, workflow?.version?.current)
        .then(() => {
          navigate(`/workspace/${workspace}`);
        })
        .catch((error) => {
          console.error(error);
          setFeedback({ message: 'Error when deleting workflow', type: 'error' });
        });
    }
  }

  if (!workflow) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {workflow?.name || ''} {workflow?.version?.current ? `(v${workflow?.version?.current})` : ''} - Workflow
          editor - Flowify
        </title>
      </Helmet>
      <Feedbacks feedback={feedback} setFeedback={setFeedback} />
      <ValidationModal
        open={validationModal}
        onClose={() => setValidationModal(false)}
        validationErrors={validationErrors}
        onValidate={onValidate}
      />
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
      <Stack direction="row" justifyContent="stretch" sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <EditorMenu
          active={activePage}
          setActive={setActivePage}
          isWorkflow
          onSave={onSave}
          dirty={dirty}
          openValidation={() => setValidationModal(true)}
          errorsLength={validationErrors?.length || 0}
        />
        {activePage === 'runs' && (
          <WorkflowJobs workflow={workflow} secrets={workspaceSecrets} jobs={jobs} fetchJobs={fetchJobs} />
        )}
        {activePage === 'document' && (
          <DocumentEditor
            document={workflow}
            setInstance={setWorkflow}
            versionsResponse={versions}
            onDelete={onDelete}
            onPublish={onPublish}
            fetchVersions={fetchWorkflowVersions}
          />
        )}
        {activePage === 'editor' && (
          <MainEditor
            component={component}
            document={workflow}
            setComponent={setComponent}
            setDocument={setWorkflow}
            workspace={workspace}
            secrets={workspaceSecrets}
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

export default WorkflowEditor;
