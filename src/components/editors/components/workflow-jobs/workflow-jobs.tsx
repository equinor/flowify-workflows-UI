import React, { FC } from 'react';
import { Grid, Stack } from '@mui/material';
import { Button, Icon, Pagination, Typography } from '@equinor/eds-core-react';
import { IJobsListRequest, Workflow } from '../../../../models/v2';
import { IPagination } from '../../../../services/v2';
import { RunWorkflow } from '../../../creators';
import moment from 'moment';
//import { Select, TextField } from '../../../ui';
import { Timestamp } from '../../../timestamp';

interface WorkflowJobsProps {
  workflow: Workflow | undefined;
  secrets: string[];
  jobs: IJobsListRequest | undefined;
  fetchJobs: (pagination: IPagination) => void;
}

export const WorkflowJobs: FC<WorkflowJobsProps> = (props: WorkflowJobsProps) => {
  const { workflow, secrets, jobs, fetchJobs } = props;

  return (
    <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      <Grid item xs={8} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0', borderLeft: '1px solid #f7f7f7' }}>
        <Stack spacing={1} padding="2rem">
          {/*  <Stack direction="row" justifyContent="stretch">
            <TextField id="jobs_search" placeholder="Search job uid" icon="search" wrapperStyles={{ flexGrow: '1' }} />
            <Select
              id="jobs_created_by"
              value="default"
              icon="account_circle"
              onChange={(event: any) => null}
              options={[
                { label: 'All users', value: 'default' },
                { label: 'My runs', value: 'me' },
              ]}
              sx={{ width: '145px' }}
            />
          </Stack> */}
          {jobs?.items?.map((job) => (
            <Stack
              key={job?.uid}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{
                padding: '2rem',
                background: '#ADE2E619',
                borderRadius: '10px',
                borderBottom: '1px solid #97CACE',
                borderRight: '1px solid #97CACE',
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h5">
                  {job.uid} {job.name}
                </Typography>
                <Typography variant="body_short">Submitted by {job?.modifiedBy}</Typography>
                <Typography variant="caption">
                  <Timestamp date={job?.timestamp} /> ({moment(job?.timestamp).format('MMMM Do YYYY, H:mm:ss')})
                </Typography>
                <Typography variant="body_short">{job?.description}</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="ghost">
                  <Icon name="visibility" />
                  View job
                </Button>
              </Stack>
            </Stack>
          ))}
          <Pagination
            totalItems={jobs?.pageInfo?.totalNumber || 0}
            itemsPerPage={10}
            withItemIndicator
            onChange={(event, page) => fetchJobs({ offset: (page - 1) * 10, limit: 10 })}
          />
        </Stack>
      </Grid>
      <Grid item xs={4} sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Stack padding="2rem">
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={6}>
            <Typography variant="h4"></Typography>
            <RunWorkflow workflow={workflow!} secrets={secrets} />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
