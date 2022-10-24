import React, { FC, useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Component, IVolume, Job, JobSubmit, Workflow } from '../../models/v2';
import { Parameter } from '../editors/components';
import { services } from '../../services';
import { useParams, useNavigate } from 'react-router-dom';
import { isNotEmptyArray } from '../../common';
import { Button, DialogWrapper, Stack } from '../ui';
import { BaseInput } from '../form';
import { ButtonProps } from '../ui/button/types';

interface RunWorkflowProps {
  // Pass the entire workflow object or a string (uid)
  workflow: Workflow | string;
  secrets?: string[];
  buttonProps?: ButtonProps;
}

export const RunWorkflow: FC<RunWorkflowProps> = (props: RunWorkflowProps) => {
  const { secrets } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [workflow, setWorkflow] = useState<Workflow>();
  const [component, setComponent] = useState<Component>();
  const [description, setDescription] = useState<string>('');
  const [volumes, setVolumes] = useState<IVolume[]>([]);

  const { workspace } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!modalOpen) {
      return;
    }
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
      });
      return;
    }
    getVolumes(props.workflow);
    setWorkflow(props.workflow as Workflow);
    setComponent(props.workflow?.component);
  }, [props.workflow, workspace, modalOpen]);

  useEffect(() => {
    if (component) {
      setWorkflow((prev) => ({
        ...prev,
        component: component,
      }));
    }
  }, [component]);

  function createInputValues() {
    const inputValues = workflow?.component?.inputs?.map((input) => {
      if (input.type === 'volume') {
        const volume = volumes.find((volume) => volume.uid === input?.userdata?.value);
        return {
          value: volume?.volume,
          target: input.name,
        };
      }
      return {
        value: input?.userdata?.value!,
        target: input.name!,
      };
    });
    return inputValues;
  }

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

  const buttonProps = props.buttonProps || {
    theme: 'create',
    leftIcon: 'launch',
    children: 'Run workflow',
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setModalOpen(true)} />
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="md">
        <DialogWrapper padding={2}>
          <Stack spacing={4}>
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

            <Button theme="create" disabled={!workflow} style={{ alignSelf: 'flex-end' }} onClick={onRun}>
              <Icon name="launch" style={{ marginRight: '0.75rem' }} />
              Run workflow
            </Button>
          </Stack>
        </DialogWrapper>
      </Dialog>
    </>
  );
};
