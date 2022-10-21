import React, { FC, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';
import WorkflowTableRow from './components/table-row';
import { Workflow } from '../../models/v2/workflow';
import { services } from '../../services';
import { CreateWorkflow } from '../creators';
import { IFilter } from '../../services/filters';
import { Paper, WorkflowIcon, Button } from '../ui';
import { IPageInfo } from '../../models/v2';
import { UserContextStore } from '../../common/context/user-context-store';
import { Select, BaseInput } from '../form';

interface IWorkflowsListing {
  workspace: string;
  showTitle?: boolean;
}

const StyledTable = styled(Table)`
  width: 100%;
  margin-top: 1rem;
`;

const WorkflowsListing: FC<IWorkflowsListing> = (props: IWorkflowsListing) => {
  const { workspace } = props;

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [page, setPage] = useState<number>(0);
  const [requestData, setRequestData] = useState<IPageInfo>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('timestamp');
  const [search, setSearch] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('name');
  const [values, setValues] = useState({ createdBy: 'default' });
  const [loadingWorkflows, setLoadingWorkflows] = useState<boolean>(true);
  const user = useContext(UserContextStore);

  useEffect(() => {
    const workflowFilters: IFilter[] = [{ name: 'workspace', value: workspace, type: 'EQUALTO' }];
    if (search !== '') {
      workflowFilters.push({ name: searchParam, type: 'SEARCH', value: search });
    }
    if (values.createdBy !== 'default') {
      workflowFilters.push({ name: 'modifiedBy.email', type: 'EQUALTO', value: user.userInfo.email });
    }
    const pagination = { limit: 10, offset: page * 10 };
    const sorting =
      orderBy === 'timestamp'
        ? `sort=${order === 'asc' ? '-' : `${encodeURIComponent('+')}`}${orderBy}`
        : `sort=${order === 'asc' ? `${encodeURIComponent('+')}` : '-'}${orderBy}`;
    setWorkflows([]);
    services.workflows
      .list(workflowFilters, pagination, sorting)
      .then((res) => {
        setRequestData(res.pageInfo);
        if (Array.isArray(res?.items)) {
          setWorkflows(res.items);
          setLoadingWorkflows(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoadingWorkflows(false);
      });
  }, [workspace, page, order, orderBy, search, searchParam, user, values]);

  const headers = [
    { label: 'Name', id: 'name', sortable: true },
    { label: 'Description', id: 'description', sortable: false },
    { label: 'Version', id: 'version', sortable: false },
    { label: 'Last modified by', id: 'modifiedBy.email', sortable: true },
    { label: 'Last modified', id: 'timestamp', sortable: true },
    { label: 'Actions', id: 'actions', sortable: false },
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
            <WorkflowIcon size={24} />
          </Stack>
          <Link to={`/workspace/${workspace}/workflows`}>
            <Typography variant="h3">Workflows</Typography>
          </Link>
        </Stack>
        <CreateWorkflow workspace={workspace} />
      </Stack>
      <Stack sx={{ padding: '1rem' }} spacing={1} alignItems="flex-start">
        <Typography variant="h5">Docs</Typography>
        <Button
          href="https://equinor.github.io/flowify-documentation/workflows/"
          theme="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Creating a workflow</span> <Icon name="chevron_right" size={16} color="#004f55" />
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="stretch">
        <Stack direction="row" sx={{ flexGrow: '2' }} spacing={1}>
          <Select
            name="workflows_searchbar--searchobject"
            label="Search"
            value={searchParam}
            style={{ width: '200px' }}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Uid', value: 'uid' },
            ]}
            onChange={(item: any) => setSearchParam(item)}
          />
          <BaseInput
            name="workflows_searchbar"
            label="&nbsp;"
            style={{ flexGrow: '2' }}
            placeholder={`Search workflow ${searchParam}`}
            value={search}
            onChange={(event: any) => setSearch(event.target.value)}
          />
        </Stack>
        <Select
          name="workflows_created_by"
          value={values.createdBy}
          label="Created by"
          icon="account_circle"
          onChange={(item: any) => setValues((prev) => ({ ...prev, createdBy: item }))}
          options={[
            { label: 'All users', value: 'default' },
            { label: 'Me', value: 'me' },
          ]}
          style={{ width: '195px' }}
        />
      </Stack>
      <>
        <StyledTable aria-rowcount={requestData?.totalNumber || 0} size="small">
          <TableHead>
            <TableRow>
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
            </TableRow>
          </TableHead>
          {requestData?.totalNumber && requestData.totalNumber > 0 ? (
            <TableBody>
              {Array.isArray(workflows) &&
                workflows.map((workflow) => (
                  <WorkflowTableRow
                    key={`${workflow?.uid}_${workflow?.version?.current}`}
                    row={workflow}
                    workspace={workspace}
                  />
                ))}
            </TableBody>
          ) : (
            !loadingWorkflows && (
              <Stack sx={{ padding: '1rem' }}>
                <Typography variant="body_short">No workflows available.</Typography>
              </Stack>
            )
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

WorkflowsListing.defaultProps = {
  showTitle: true,
};

export default WorkflowsListing;
