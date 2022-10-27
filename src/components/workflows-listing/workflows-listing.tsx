import React, { FC, useEffect, useState, useContext } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Workflow } from '../../models/v2/workflow';
import { services } from '../../services';
import { IFilter } from '../../services/filters';
import { IPageInfo } from '../../models/v2';
import { UserContextStore } from '../../common/context/user-context-store';
import { Select, BaseInput } from '../form';
import { WorkflowCard } from './workflow-card/workflow-card';
import { Pagination, Stack } from '../ui';

interface IWorkflowsListing {
  workspace: string;
  showTitle?: boolean;
}

const WorkflowsListing: FC<IWorkflowsListing> = (props: IWorkflowsListing) => {
  const { workspace } = props;

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [page, setPage] = useState<number>(1);
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
    const itemsPerPage = 10;
    const pagination = { limit: itemsPerPage, offset: page === 1 ? 0 : (page - 1) * itemsPerPage };
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

  const headerSortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Last modified by', value: 'modifiedBy.email' },
    { label: 'Last modified', value: 'timestamp' },
  ];

  return (
    <Stack spacing={1} style={{ width: '100%' }}>
      {/*  <Stack sx={{ padding: '1rem' }} spacing={1} alignItems="flex-start">
        <Typography variant="h5">Docs</Typography>
        <Button
          href="https://equinor.github.io/flowify-documentation/workflows/"
          theme="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Creating a workflow</span> <Icon name="chevron_right" size={16} color="#004f55" />
        </Button>
      </Stack> */}
      <Stack direction="row" spacing={1} justifyContent="stretch">
        <Stack direction="row" style={{ flexGrow: '2' }} spacing={0.5}>
          <Select
            name="workflows_searchbar--searchobject"
            label="Search"
            value={searchParam}
            style={{ width: '100px' }}
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
        <Stack direction="row" spacing={0.5}>
          <Select
            name="workflows_sort"
            value={orderBy}
            options={headerSortOptions}
            onChange={(item) => setOrderBy(item)}
            label="Order by"
            style={{ width: '185px' }}
          />
          <Select
            name="workflows_sortorder"
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
        {loadingWorkflows ? null : requestData?.totalNumber && requestData.totalNumber > 0 ? (
          Array.isArray(workflows) &&
          workflows.map((workflow) => <WorkflowCard key={workflow?.uid} workflow={workflow} workspace={workspace} />)
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

WorkflowsListing.defaultProps = {
  showTitle: true,
};

export default WorkflowsListing;
