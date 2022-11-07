import React, { FC, useContext, useEffect, useState } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { services, IFilter } from '@services';
import { Job, IPageInfo } from '@models/v2';
import { Pagination, Stack } from '@ui';
import { UserContextStore } from '@common';
import { BaseInput, Select } from '@form';
import { JobCard } from './job-card/job-card';

interface IJobsListing {
  workspace: string;
  showTitle?: boolean;
}

const JobsListing: FC<IJobsListing> = (props: IJobsListing) => {
  const { workspace } = props;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requestData, setRequestData] = useState<IPageInfo>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('timestamp');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('uid');
  const [values, setValues] = useState({ createdBy: 'default' });
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const user = useContext(UserContextStore);

  useEffect(() => {
    const jobsFilters: IFilter[] = [{ name: 'workflow.workspace', value: workspace, type: 'EQUALTO' }];
    if (search !== '') {
      jobsFilters.push({ name: searchParam, type: 'SEARCH', value: search });
    }
    if (values.createdBy !== 'default') {
      jobsFilters.push({ name: 'modifiedBy.email', type: 'EQUALTO', value: user.userInfo.email });
    }
    const itemsPerPage = 10;
    const pagination = { limit: itemsPerPage, offset: page === 1 ? 0 : (page - 1) * itemsPerPage };
    const sorting =
      orderBy === 'timestamp'
        ? `sort=${order === 'asc' ? '-' : `${encodeURIComponent('+')}`}${orderBy}`
        : `sort=${order === 'asc' ? `${encodeURIComponent('+')}` : '-'}${orderBy}`;
    setJobs([]);
    services.jobs
      .list(jobsFilters, pagination, sorting)
      .then((res) => {
        setLoadingJobs(false);
        setRequestData(res.pageInfo);
        setJobs(res.items);
      })
      .catch((error) => console.error(error));
  }, [workspace, page, order, orderBy, search, searchParam, user, values]);

  const headerSortOptions = [
    { label: 'Submitted', value: 'timestamp' },
    { label: 'Name', value: 'name' },
    { label: 'Submitted by', value: 'modifiedBy.email' },
  ];

  return (
    <Stack spacing={1} style={{ width: '100%' }}>
      <Stack direction="row" spacing={1} justifyContent="stretch">
        <Stack direction="row" style={{ flexGrow: '2' }} spacing={0.5}>
          <Select
            name="jobs_searchbar--searchobject"
            label="Search"
            value={searchParam}
            style={{ width: '130px' }}
            options={[
              { label: 'Job ID', value: 'uid' },
              { label: 'Description', value: 'description' },
            ]}
            onChange={(item) => setSearchParam(item)}
          />
          <BaseInput
            name="jobs_searchbar"
            label="&nbsp;"
            style={{ flexGrow: '2' }}
            placeholder={`Search job ${searchParam}`}
            value={search}
            onChange={(event: any) => setSearch(event.target.value)}
          />
        </Stack>
        <Select
          name="jobs_created_by"
          value={values.createdBy}
          label="Submitted by"
          icon="account_circle"
          onChange={(item) => setValues((prev) => ({ ...prev, createdBy: item }))}
          options={[
            { label: 'All users', value: 'default' },
            { label: 'Me', value: 'me' },
          ]}
          style={{ width: '195px' }}
        />
        <Stack direction="row" spacing={0.5}>
          <Select
            name="jobs_sort"
            value={orderBy}
            options={headerSortOptions}
            onChange={(item) => setOrderBy(item)}
            label="Order by"
            style={{ width: '185px' }}
          />
          <Select
            name="jobs_sortorder"
            value={order}
            options={[
              { label: 'Asc', value: 'asc' },
              { label: 'Desc', value: 'desc' },
            ]}
            onChange={(item: any) => setOrder(item)}
            label="&nbsp;"
            icon="swap_vertical"
            style={{ width: '145px' }}
          />
        </Stack>
      </Stack>
      <Stack spacing={0.75}>
        {loadingJobs ? null : requestData?.totalNumber && requestData.totalNumber > 0 ? (
          Array.isArray(jobs) && jobs.map((job) => <JobCard key={job?.uid} job={job} workspace={workspace} />)
        ) : (
          <Typography variant="body_short">No workflows available</Typography>
        )}
        <Pagination
          total={requestData?.totalNumber || 0}
          page={page}
          onPageChange={setPage}
          itemsPerPage={requestData?.limit}
        />
      </Stack>
    </Stack>
  );
};

JobsListing.defaultProps = {
  showTitle: true,
};

export default JobsListing;
