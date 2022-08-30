import React, { FC, useEffect, useState } from 'react';
import { Dialog, Stack, TextField } from '@mui/material';
import { Button, Typography } from '@equinor/eds-core-react';
import { Component, IVolume, Job, JobSubmit, Workflow } from '../../models/v2';
import { Parameter } from '../editors/components';
import { services } from '../../services/v2';
import { useParams, useNavigate } from 'react-router-dom';
import { isNotEmptyArray } from '../../common';

interface RunWorkflowProps {
  // Pass the entire workflow object or a string (uid)
  workflow: Workflow | string;
  secrets?: string[];
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
      console.log(inputVolumes);
      console.log(uniqueVolumeIds);
      if (isNotEmptyArray(uniqueVolumeIds)) {
        await Promise.all(
          uniqueVolumeIds.map(async (id) => {
            const res = await services.volumes.get(workspace!, id as string);
            usedVolumes.push(res);
          }),
        );
      }
      console.log(usedVolumes);
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
      // @ts-expect-error
      setWorkflow((prev: Workflow) => ({
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

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Run workflow</Button>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="md">
        <Stack sx={{ padding: '2rem' }} spacing={2}>
          <Typography variant="h5">Input values</Typography>
          <Stack spacing={1}>
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
              />
            ))}
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h6">Job description</Typography>
            <TextField
              id="workflow_description"
              fullWidth
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              placeholder="Please provide a short description why the job was run"
              rows={3}
            />
          </Stack>
          <Button disabled={!workflow} style={{ alignSelf: 'flex-end' }} onClick={onRun}>
            Run workflow
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};
