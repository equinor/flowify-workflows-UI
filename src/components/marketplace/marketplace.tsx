import React, { FC, useState, useEffect, useContext } from 'react';
import { Grid, Stack } from '@mui/material';
import { Button, Icon, Progress, Snackbar, Typography, Pagination } from '@equinor/eds-core-react';
import moment from 'moment';
import { Component, IPageInfo } from '../../models/v2';
import { services, IFilter } from '../../services/v2';
import { isNotEmptyArray } from '../../common/general-helpers';
import { ComponentCard } from './components/component-card';
import { AddComponentToGraph, CreateComponent } from '../creators';
import { Select, TextField, ButtonLink } from '../ui';
import { UserContextStore } from '../../common/context/user-context-store';
import { Link } from 'react-router-dom';

interface MarketplaceProps {
  onAddComponent?: any;
  showTitle?: boolean;
  preview?: boolean;
}

export const Marketplace: FC<MarketplaceProps> = (props: MarketplaceProps) => {
  const { onAddComponent, preview } = props;

  const [values, setValues] = useState({ createdBy: 'default', type: 'default', date: 'default' });
  const [search, setSearch] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('name');
  const [components, setComponents] = useState<Component[]>([]);
  const [requestData, setRequestData] = useState<IPageInfo>();
  const [page, setPage] = useState<number>(1);
  const [searchSnackbar, setSearchSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const user = useContext(UserContextStore);

  useEffect(() => {
    setLoading(true);
    console.log('get components');

    function createFilterObjects() {
      const filters: IFilter[] = [];
      if (values.createdBy !== 'default') {
        filters.push({ name: 'modifiedBy', type: 'EQUALTO', value: user.userInfo.email });
      }
      if (values.type !== 'default') {
        filters.push({ name: 'implementation.type', type: 'EQUALTO', value: values.type });
      }
      if (values.date !== 'default') {
        const dateObjects = values.date.split('_');
        // @ts-expect-error
        const date = moment().subtract(dateObjects[0]!, dateObjects[1]!).utc().format();
        console.log(date);
        filters.push({ name: 'timestamp', type: 'MORETHAN', value: date });
      }
      if (search !== '') {
        filters.push({ name: searchParam, type: 'SEARCH', value: search });
      }
      return filters;
    }

    const filters = createFilterObjects();
    const pagination = { limit: preview ? 3 : 12, offset: (page - 1) * 12 };
    const sorting = 'sort=-timestamp';

    services.components
      .list(filters, pagination, sorting)
      .then((res) => {
        setComponents(res.items);
        setRequestData(res.pageInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [values, user, preview, page, search, searchParam]);

  useEffect(() => {
    setPage(1);
  }, [values]);

  return (
    <>
      <Snackbar open={searchSnackbar} onClose={() => setSearchSnackbar(false)} placement="top">
        Search is not implemented yet. We are working on it!
        <Snackbar.Action>
          <Button onClick={() => setSearchSnackbar(false)} variant="ghost">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <Stack spacing={3}>
        {props.showTitle && !preview && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Icon name="mall" color="#709DA0" style={{ margin: '1rem' }} />
              <Link to="/components">
                <Typography variant="h3">Marketplace</Typography>
              </Link>
            </Stack>
            <ButtonLink as="button" create onClick={() => setCreateModalOpen(true)}>
              <Icon name="add" size={24} color="#709DA0" />
              Create new component
            </ButtonLink>
            <CreateComponent open={createModalOpen} setOpen={setCreateModalOpen} />
          </Stack>
        )}
        <Stack rowGap={3}>
          {!preview && (
            <Stack justifyContent="stretch" direction="row" spacing={2}>
              <Stack direction="row" sx={{ flexGrow: '2' }}>
                <Select
                  id="marketplace_searchbar--searchobject"
                  label="Search"
                  value={searchParam}
                  wrapperStyles={{ width: '200px' }}
                  options={[
                    { label: 'Name', value: 'name' },
                    { label: 'Description', value: 'description' },
                  ]}
                  onChange={(event: any) => setSearchParam(event.target.value)}
                />
                <TextField
                  id="marketplace_searchbar"
                  label="&nbsp;"
                  wrapperStyles={{ flexGrow: '2' }}
                  placeholder={`Search component ${searchParam}`}
                  value={search}
                  onChange={(event: any) => setSearch(event.target.value)}
                />
              </Stack>
              <Select
                id="marketplace_created_by"
                value={values.createdBy}
                label="Created by"
                icon="account_circle"
                onChange={(event: any) => setValues((prev) => ({ ...prev, createdBy: event.target.value }))}
                options={[
                  { label: 'All users', value: 'default' },
                  { label: 'Me', value: 'me' },
                ]}
                sx={{ width: '145px' }}
              />
              <Select
                id="marketplace_date"
                icon="time"
                value={values.date}
                label="Last modified"
                onChange={(event: any) => setValues((prev) => ({ ...prev, date: event.target.value }))}
                options={[
                  { label: 'Anytime', value: 'default' },
                  { label: 'Last day', value: '1_days' },
                  { label: 'Last week', value: '7_days' },
                  { label: 'Last month', value: '30_days' },
                  { label: 'Last three months', value: '3_months' },
                  { label: 'Last six months', value: '6_months' },
                  { label: 'Last year', value: '1_year' },
                ]}
                sx={{ width: '220px' }}
              />
              <Select
                id="marketplace_type"
                value={values.type}
                label="Type"
                onChange={(event: any) => setValues((prev) => ({ ...prev, type: event.target.value }))}
                options={[
                  { label: 'All types', value: 'default' },
                  { label: 'Any', value: 'any' },
                  { label: 'Brick', value: 'brick' },
                  { label: 'Graph', value: 'graph' },
                ]}
                sx={{ width: '110px' }}
              />
            </Stack>
          )}
          <Grid container justifyContent="flex-start" spacing={2}>
            {loading && <Progress.Dots />}
            {isNotEmptyArray(components) &&
              !loading &&
              components.map((component) => (
                <Grid key={`${component.uid}_${component?.version?.current}`} item xs={4}>
                  <ComponentCard component={component}>
                    {typeof onAddComponent === 'function' && (
                      <AddComponentToGraph component={component} onAddComponent={onAddComponent} />
                    )}
                  </ComponentCard>
                </Grid>
              ))}
          </Grid>
          {!preview && page && (
            <Pagination
              totalItems={requestData?.totalNumber || 0}
              itemsPerPage={requestData?.limit}
              defaultPage={page}
              onChange={(event, page) => setPage(page)}
            />
          )}
        </Stack>
        {preview ? (
          <Stack alignItems="flex-end">
            <ButtonLink simple>
              <Link to="/components">Visit marketplace</Link>
              <Icon name="chevron_right" size={16} />
            </ButtonLink>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
};

Marketplace.defaultProps = {
  showTitle: true,
};
