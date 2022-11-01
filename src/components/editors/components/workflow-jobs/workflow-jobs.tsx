import React, { FC, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import { IJobsListRequest, Workflow } from '../../../../models/v2';
import { IFilter, IPagination } from '../../../../services';
import { RunWorkflow } from '../../../creators';
import { Timestamp } from '../../../timestamp';
import { Paper, Button, Pagination, Stack, Grid } from '../../../ui';
import { BaseInput, Select } from '../../../form';
import { UserContextStore } from '../../../../common/context/user-context-store';

interface WorkflowJobsProps {
  workflow: Workflow | undefined;
  secrets: string[];
  jobs: IJobsListRequest | undefined;
  fetchJobs: (pagination: IPagination, filters: IFilter[] | undefined) => void;
  workspace: string;
}

export const WorkflowJobs: FC<WorkflowJobsProps> = (props: WorkflowJobsProps) => {
  const { workflow, secrets, jobs, fetchJobs } = props;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [searchParam, setSearchParam] = useState('uid');
  const [values, setValues] = useState<{ modifiedBy: string }>({ modifiedBy: 'default' });
  const user = useContext(UserContextStore);
  const itemsPerPage = 10;

  useEffect(() => {
    function createFilters() {
      const filters: IFilter[] = [{ name: 'workflow.uid', value: workflow?.uid || '', type: 'EQUALTO' }];
      if (values?.modifiedBy !== 'default') {
        filters.push({ name: 'modifiedBy.email', type: 'EQUALTO', value: user?.userInfo?.email });
      }
      if (search !== '') {
        filters.push({ name: searchParam, type: 'SEARCH', value: search });
      }
      return filters;
    }
    const filters = createFilters();
    const pagination = { limit: itemsPerPage, offset: page === 1 ? 0 : (page - 1) * itemsPerPage };

    fetchJobs(pagination, filters);
  }, [fetchJobs, page, search, searchParam, values, user, workflow?.uid]);

  return (
    <Grid container style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      <Grid item xs={8} style={{ flexGrow: '1', overflowY: 'auto', minHeight: '0', borderLeft: '1px solid #f7f7f7' }}>
        <Stack spacing={1} padding={2}>
          <Stack direction="row" justifyContent="stretch" spacing={1}>
            <Select
              name="searchParam"
              value={searchParam}
              options={[
                { label: 'Uid', value: 'uid' },
                { label: 'Description', value: 'description' },
              ]}
              onChange={(item) => setSearchParam(item)}
              style={{ width: '150px' }}
            />
            <BaseInput
              name="jobs_search"
              placeholder={`Search job ${searchParam}`}
              onChange={(event: any) => setSearch(event.target.value)}
              startEnhancer={<Icon name="search" />}
              style={{ flexGrow: '1' }}
            />
            <Select
              name="jobs_created_by"
              value={values?.modifiedBy}
              icon="account_circle"
              onChange={(modifiedBy) => setValues((prev) => ({ ...prev, modifiedBy }))}
              options={[
                { label: 'All users', value: 'default' },
                { label: 'My runs', value: 'me' },
              ]}
              style={{ width: '175px' }}
            />
          </Stack>
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
                <Typography variant="caption">
                  Submitted <Timestamp date={job?.timestamp} /> (
                  {moment(job?.timestamp).format('MMMM Do YYYY, H:mm:ss')}) by {job?.modifiedBy?.email}
                </Typography>
                {job?.description && <Typography variant="body_short">{job?.description}</Typography>}
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
            page={page}
            total={jobs?.pageInfo?.totalNumber || 0}
            onPageChange={setPage}
            itemsPerPage={jobs?.pageInfo?.limit}
          />
        </Stack>
      </Grid>
      <Grid item xs={4} style={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
        <Stack padding={2}>
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={6}>
            <Typography variant="h4"></Typography>
            <RunWorkflow workflow={workflow!} secrets={secrets} />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
