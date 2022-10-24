import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import { Job } from '../../../models/v2';
import { Timestamp } from '../../timestamp';
import { Paper, Stack } from '../../ui';

interface JobCardProps {
  job: Job;
  workspace: string;
}

export const JobCard: FC<JobCardProps> = (props: JobCardProps) => {
  const { job, workspace } = props;
  return (
    <Stack direction="row" justifyContent="stretch" spacing={1}>
      <Link style={{ flexGrow: '2' }} to={`/workspace/${workspace}/job/${job?.uid}`}>
        <Paper
          direction="row"
          spacing={2}
          theme="light"
          padding={2}
          alignItems="center"
          justifyContent="space-between"
          key={job?.uid}
          hoverable
        >
          <div>
            <Typography variant="h5">{job?.uid}</Typography>
            <Typography variant="body_short">{job?.description}</Typography>
          </div>
          <div>
            <Typography variant="body_short">
              Submitted <Timestamp date={job?.timestamp!} /> by {job?.modifiedBy?.email}
            </Typography>
          </div>
        </Paper>
      </Link>
    </Stack>
  );
};
