import React, { FC } from 'react';
import { Grid, Stack } from '@mui/material';
import { Pagination, Typography } from '@equinor/eds-core-react';
import { IJobsListRequest, Workflow } from '../../../../models/v2';
import { IPagination } from '../../../../services';
import { RunWorkflow } from '../../../creators';
import moment from 'moment';
//import { Select, TextField } from '../../../ui';
import { Timestamp } from '../../../timestamp';
import { Paper, Button } from '../../../ui';
import { Link } from 'react-router-dom';

interface WorkflowJobsProps {
  workflow: Workflow | undefined;
  secrets: string[];
  jobs: IJobsListRequest | undefined;
  fetchJobs: (pagination: IPagination) => void;
  workspace: string;
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
            <Paper
              key={job?.uid}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              padding={2}
            >
              <Stack spacing={1}>
                <Typography variant="h5">
                  {job.uid} {job.name}
                </Typography>
                <Typography variant="body_short">Submitted by {job?.modifiedBy?.email}</Typography>
                <Typography variant="caption">
                  <Timestamp date={job?.timestamp} /> ({moment(job?.timestamp).format('MMMM Do YYYY, H:mm:ss')})
                </Typography>
                <Typography variant="body_short">{job?.description}</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Link to={`/workspace/${props.workspace}/job/${job?.uid}`}>
                  <Button as="span" leftIcon="visibility">
                    View job
                  </Button>
                </Link>
              </Stack>
            </Paper>
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
