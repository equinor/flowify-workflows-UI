import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Job } from '@models/v2';
import { Button, Paper, Chip, Stack, Grid, ChipTheme, Timestamp } from '@ui';
import { DurationPanel } from './duration-panel/duration-panel';
import { Workflow } from '../../../../models';

interface IJobSidebar {
  jobWatch: Workflow | undefined;
  inputs?: any;
  job: Job | undefined;
  onTerminate: () => void;
  onDelete: () => void;
}

const JobSidebar: FC<IJobSidebar> = (props: IJobSidebar) => {
  const { jobWatch, inputs, job, onTerminate, onDelete } = props;

  const phaseTheme: { [name: string]: ChipTheme } = {
    Pending: 'default',
    Running: 'default',
    Succeeded: 'success',
    Failed: 'error',
    Error: 'error',
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="h3">{job?.uid}</Typography>
      <Typography variant="body_short">{job?.description}</Typography>
      <Grid container spacing={0.5}>
        <Grid item xs={8}>
          Workflow
        </Grid>
        <Grid item xs={4}>
          <Link target="_blank" to={`/workspace/${job?.workflow?.workspace}/workflow/${job?.workflow?.uid}`}>
            <Button as="span" theme="simple">
              {job?.workflow?.name} v{job?.workflow?.version?.current}
            </Button>
          </Link>
        </Grid>
        <Grid item xs={8}>
          Status
        </Grid>
        <Grid item xs={4}>
          <Chip theme={phaseTheme[jobWatch?.status?.phase as keyof typeof phaseTheme]}>{jobWatch?.status?.phase}</Chip>
        </Grid>
        <Grid item xs={8}>
          Run
        </Grid>
        <Grid item xs={4}>
          <Timestamp date={jobWatch?.status?.finishedAt} />
        </Grid>
        <Grid item xs={8}>
          Duration
        </Grid>
        <Grid item xs={4}>
          <DurationPanel status={jobWatch?.status!} />
        </Grid>
        <Grid item xs={8}>
          Submitted by
        </Grid>
        <Grid item xs={4}>
          {job?.modifiedBy?.email}
        </Grid>
      </Grid>
      <Stack spacing={1}>
        <Typography variant="h4">Parameters</Typography>
        {inputs?.parameters?.map((parameter: any) => (
          <Paper theme="light" padding={1} key={parameter.name}>
            <div style={{ flexGrow: '2' }}>
              <Typography variant="h5">{parameter.name}</Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                style={{ paddingLeft: '0.25rem', paddingTop: '0.25rem' }}
              >
                <Icon name="subdirectory_arrow_right" color="#007079" size={16} />
                <Typography variant="caption">{parameter.value || 'undefined'}</Typography>
              </Stack>
            </div>
          </Paper>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        {jobWatch?.status?.phase === 'Running' || jobWatch === undefined ? (
          <Button onClick={onTerminate}>Terminate job</Button>
        ) : null}
        <Button theme="danger" onClick={onDelete}>
          Delete job
        </Button>
      </Stack>
    </Stack>
  );
};

export default JobSidebar;
