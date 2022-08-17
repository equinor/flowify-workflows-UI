import React, { FC } from 'react';
import { Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { Workflow } from '../../../../models';
import { Timestamp } from '../../../timestamp';
import { DurationPanel } from '../../../duration-panel';
import styled from 'styled-components';

interface IJobSidebar {
  job: Workflow | undefined;
  inputs?: any;
}

const ParameterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  column-gap: 1rem;
  padding: 0.75rem;
  border-left: 3px solid #007079;
`;

const JobSidebar: FC<IJobSidebar> = (props: IJobSidebar) => {
  const { job, inputs } = props;

  type PhaseTheme = 'active' | 'error' | undefined;

  const phaseTheme: { [name: string]: PhaseTheme } = {
    Pending: undefined,
    Running: undefined,
    Succeeded: 'active',
    Failed: 'error',
    Error: 'error',
  };
  return (
    <Stack spacing={1}>
      <div>
        <Typography variant="body_short_bold">Status</Typography>
        <Chip variant={phaseTheme[job?.status?.phase as keyof typeof phaseTheme]}>{job?.status?.phase}</Chip>
      </div>
      <Typography variant="body_short">
        <b>Run: </b>
        <Timestamp date={job?.status?.finishedAt} />
      </Typography>
      <Typography variant="body_short">
        <b>Duration: </b>
        <DurationPanel status={job?.status!} />
      </Typography>
      <Typography variant="body_short">
        <b>Workflow version: </b>v{job?.metadata.generation}
      </Typography>
      <Typography variant="h4">Parameters</Typography>
      <Stack spacing={1}>
        {inputs?.parameters?.map((parameter: any) => (
          <ParameterWrapper key={parameter.name}>
            <div style={{ flexGrow: '2' }}>
              <Typography variant="h5">{parameter.name}</Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ paddingLeft: '0.25rem', paddingTop: '0.25rem' }}
              >
                <Icon name="subdirectory_arrow_right" color="#007079" size={16} />
                <Typography variant="caption">{parameter.value || 'undefined'}</Typography>
              </Stack>
            </div>
          </ParameterWrapper>
        ))}
      </Stack>
    </Stack>
  );
};

export default JobSidebar;
