import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Stack,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';
import JobTableRow from './components/table-row';
import { services } from '../../services';
import { Job, IPageInfo } from '../../models/v2';
import { IFilter } from '../../services/filters';
import { Paper, Select, TextField } from '../ui';
import { UserContextStore } from '../../common/context/user-context-store';

interface IJobsListing {
  workspace: string;
  showTitle?: boolean;
}

const StyledTable = styled(Table)`
  width: 100%;
`;

const JobsListing: FC<IJobsListing> = (props: IJobsListing) => {
  const { workspace } = props;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requestData, setRequestData] = useState<IPageInfo>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('timestamp');
  const [page, setPage] = useState<number>(0);
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
      jobsFilters.push({ name: 'modifiedBy', type: 'EQUALTO', value: user.userInfo.email });
    }
    const pagination = { limit: 10, offset: page * 10 };
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

  const headers = [
    { label: 'Job ID', id: 'uid', sortable: true },
    { label: 'Submitted by', id: 'modifiedBy', sortable: true },
    { label: 'Submitted', id: 'timestamp', sortable: true },
    { label: 'Name', id: 'name', sortable: true },
    { label: 'Description', id: 'description', sortable: false },
  ];

  function onSort(header: string) {
    if (header === orderBy) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setOrderBy(header);
    setOrder('asc');
  }

  return (
    <Paper spacing={2} padding={2}>
      <Stack direction="row" spacing={5} alignContent="center">
        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: '1', height: '100%' }}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Stack sx={{ padding: '1rem' }}>
            <Icon size={24} name="play_circle" color="#709DA0" />
          </Stack>
          <Link to={`/workspace/${workspace}/jobs`}>
            <Typography variant="h3">Jobs</Typography>
          </Link>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="stretch">
        <Stack direction="row" sx={{ flexGrow: '2' }}>
          <Select
            id="jobs_searchbar--searchobject"
            label="Search"
            value={searchParam}
            wrapperStyles={{ width: '200px' }}
            options={[
              { label: 'Job ID', value: 'uid' },
              { label: 'Description', value: 'description' },
            ]}
            onChange={(event: any) => setSearchParam(event.target.value)}
          />
          <TextField
            id="jobs_searchbar"
            label="&nbsp;"
            wrapperStyles={{ flexGrow: '2' }}
            placeholder={`Search job ${searchParam}`}
            value={search}
            onChange={(event: any) => setSearch(event.target.value)}
          />
        </Stack>
        <Select
          id="jobs_created_by"
          value={values.createdBy}
          label="Submitted by"
          icon="account_circle"
          onChange={(event: any) => setValues((prev) => ({ ...prev, createdBy: event.target.value }))}
          options={[
            { label: 'All users', value: 'default' },
            { label: 'Me', value: 'me' },
          ]}
          sx={{ width: '145px' }}
        />
      </Stack>
      <>
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              <TableCell width={80}>&nbsp;</TableCell>
              <TableCell width={80}>&nbsp;</TableCell>
              {headers.map((header) => (
                <TableCell key={header.id} sortDirection={order}>
                  {header.sortable ? (
                    <TableSortLabel active={header.id === orderBy} direction={order} onClick={() => onSort(header.id)}>
                      {header.label}
                    </TableSortLabel>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          {!loadingJobs && requestData?.totalNumber && requestData?.totalNumber > 0 ? (
            <TableBody>
              {Array.isArray(jobs) && jobs.map((job) => <JobTableRow key={job?.uid} workspace={workspace} row={job} />)}
            </TableBody>
          ) : (
            <TableBody sx={{ padding: '1rem' }}>
              <TableRow>
                <TableCell>No jobs available.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </StyledTable>
        {requestData && (
          <TablePagination
            sx={{ width: '100%' }}
            component="div"
            count={requestData.totalNumber}
            page={page}
            rowsPerPage={10}
            onPageChange={(event, page) => setPage(page)}
            rowsPerPageOptions={[10]}
          />
        )}
      </>
    </Paper>
  );
};

JobsListing.defaultProps = {
  showTitle: true,
};

export default JobsListing;
