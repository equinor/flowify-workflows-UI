import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Component, InputValue, IVolume, Job, JobSubmit, Workflow } from '@models/v2';
import { services } from '@services';
import { isNotEmptyArray } from '@common';
import { Button, DialogWrapper, Message, Stack, Modal } from '@ui';
import { BaseInput } from '@form';
import { checkConnections } from '@common';
import { fetchInitialSubComponents } from '../../editors/helpers';
import { Parameter } from '../../editors/components';
import { RunWorkflowProps } from './types';

/**
 * Run Workflow
 * Modal that handles running of workflow and can be called from anywhere as long as you pass workflow uid or full workflow object as prop
 * - Fetches workflow if you pass as uid string
 * - Fetches volumes and replaces volume uid reference with volume object
 * - Fetches subcomponents and validates that all parameters in workflow has valid connections
 * - Includes parameter editor so that user can change parameter values on the spot/differ from default values set for workflow parameter
 * - Builds job object/creates input values
 * - Navigates user to job-page if job is successfully updated
 * @param props
 * @returns
 */

export const RunWorkflow: FC<RunWorkflowProps> = (props: RunWorkflowProps) => {
  const { secrets } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [workflow, setWorkflow] = useState<Workflow>();
  const [component, setComponent] = useState<Component>();
  const [description, setDescription] = useState<string>('');
  const [volumes, setVolumes] = useState<IVolume[]>([]);
  const [workflowWarning, setWorkflowWarnings] = useState<string[]>();

  const { workspace } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!modalOpen) {
      return;
    }
    /**
     * Fetch all volumes used in workflow and set to state so that we can use them when workflow is run
     * @param workflow
     */
    async function getVolumes(workflow: Workflow) {
      const inputVolumes = workflow?.component?.inputs
        ?.filter((input) => input.type === 'volume')
        .map((input) => input.userdata?.value);
      const uniqueVolumeIds = [...new Set(inputVolumes)];
      const usedVolumes: IVolume[] = [];
      if (isNotEmptyArray(uniqueVolumeIds)) {
        await Promise.all(
          uniqueVolumeIds.map(async (id) => {
            const res = await services.volumes.get(workspace!, id as string);
            usedVolumes.push(res);
          }),
        );
      }
      setVolumes(usedVolumes);
    }

    /**
     * If the workflow is only passed as a string (uid) we need to fetch it first to get the entire workflow object. (used in listings where you only have the workflow metadata and not the whole workflow object)
     */
    if (typeof props.workflow === 'string') {
      services.workflows.get(props.workflow!).then((res) => {
        getVolumes(res);
        setWorkflow(res);
        setComponent(res.component);
        fetchInitialSubComponents(res.component).then((components) => {
          checkConnections(res.component, components || []).then((warnings) => setWorkflowWarnings(warnings));
        });
      });
      return;
    }
    // Otherwise we fetch all other things we need to run job with the passed workflow object
    getVolumes(props.workflow);
    setWorkflow(props.workflow as Workflow);
    setComponent(props.workflow?.component);
    fetchInitialSubComponents(props?.workflow?.component).then((components) => {
      checkConnections((props?.workflow as Workflow)?.component, components || []).then((warnings) =>
        setWorkflowWarnings(warnings),
      );
    });
  }, [props.workflow, workspace, modalOpen]);

  /**
   * On component change hook. Updates entire workflow object when parameter-editor updates component object.
   */
  useEffect(() => {
    if (component) {
      setWorkflow((prev) => ({
        ...prev,
        component: component,
      }));
    }
  }, [component]);

  /**
   * createInputValues
   * Map inputs to inputValue objects + switch out volume reference uids with stringified volume objects
   */
  function createInputValues(): InputValue[] {
    const inputValues = workflow?.component?.inputs?.map((input) => {
      if (input.type === 'volume') {
        const volume = volumes.find((volume) => volume.uid === input?.userdata?.value);
        return {
          value: JSON.stringify(volume?.volume) || '',
          target: input.name!,
        };
      }
      return {
        value: input?.userdata?.value!,
        target: input.name!,
      };
    });
    return inputValues || [];
  }

  /**
   * On workflow run
   * - Create job object
   * - Submit job
   * - Navigate to job-page if submit was successful
   */
  function onRun() {
    const job: Job = {
      type: 'job',
      workflow: workflow!,
      inputValues: createInputValues(),
      description,
    };
    const submitJob: JobSubmit = {
      ...job,
    };
    services.jobs
      .submit(submitJob)
      .then((res) => {
        const locationArray = res.split('/');
        const uid = locationArray[locationArray.length - 1];
        if (typeof uid === 'string') {
          navigate(`/workspace/${workspace}/job/${uid}`);
        }
      })
      .catch((error) => console.error(error));
  }

  // Set default or passed buttonProps for "Run workflow" button
  const buttonProps = props.buttonProps || {
    theme: 'create',
    leftIcon: 'launch',
    children: 'Run workflow',
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setModalOpen(true)} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="md">
        <DialogWrapper padding={2}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h5">Input values</Typography>
              {workflow?.component?.inputs?.map((input, index) => (
                <Parameter
                  key={input.name}
                  parameter={input}
                  index={index}
                  type="input"
                  setComponent={setComponent}
                  onlyEditableValue
                  editableValue
                  secrets={secrets}
                  volume={input?.type === 'volume'}
                  secret={input?.type === 'env_secret'}
                />
              ))}
            </Stack>
            <BaseInput
              label="Job description"
              name="workflow_description"
              value={description}
              onChange={(event: any) => setDescription(event.target.value)}
              multiline
              placeholder="Please provide a short description why the job was run"
              rows={3}
            />

            {isNotEmptyArray(workflowWarning) && (
              <Message theme="warning" icon="warning_outlined">
                <div>
                  <Typography variant="h5">Workflow warnings</Typography>
                  {workflowWarning?.map((warning) => (
                    <Typography key={warning} variant="body_short">
                      - {warning}
                    </Typography>
                  ))}
                </div>
              </Message>
            )}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button theme="create" disabled={!workflow} onClick={onRun}>
                <Icon name="launch" style={{ marginRight: '0.75rem' }} />
                Run workflow
              </Button>
            </Stack>
          </Stack>
        </DialogWrapper>
      </Modal>
    </>
  );
};
