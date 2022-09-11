import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Chip, Icon, Pagination, Typography } from '@equinor/eds-core-react';
import { Grid, Stack, TextField } from '@mui/material';
import moment from 'moment';
import { Workflow, Component, WorkflowListRequest, ComponentListRequest } from '../../../../models/v2';
import { Button, Paper } from '../../../ui';
import { Link } from 'react-router-dom';
import { IFilter, IPagination } from '../../../../services/v2';

interface DocumentEditorProps {
  document: Workflow | Component | undefined;
  setInstance: any;
  versionsResponse?: WorkflowListRequest | ComponentListRequest | undefined;
  onPublish: () => void;
  fetchVersions: (
    filters: IFilter[] | undefined,
    pagination: IPagination | undefined,
    sorting: string | undefined,
  ) => void;
}

const StyledTextButton = styled.button`
  background: none;
  border: none;
  cursor: text;
  padding: 0;
`;

export const DocumentEditor: FC<DocumentEditorProps> = (props: DocumentEditorProps) => {
  const { document, setInstance, versionsResponse, fetchVersions } = props;
  const [editName, setEditName] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<boolean>(false);

  const { items: versions, pageInfo } = versionsResponse as WorkflowListRequest | ComponentListRequest;

  function updateName(event: any) {
    const { value } = event.target;
    setInstance((prev: Component | Workflow) => ({
      ...prev,
      name: value,
    }));
    setEditName(false);
  }

  function updateDescription(event: any) {
    const { value } = event.target;
    setInstance((prev: Component | Workflow) => ({
      ...prev,
      description: value,
    }));
    setEditDescription(false);
  }

  return (
    <Grid container sx={{ flexGrow: '1', minHeight: '0', flexWrap: 'nowrap' }}>
      <Grid
        item
        xs={8}
        sx={{ borderLeft: '1px solid #f7f7f7', flexGrow: '1', overflowY: 'auto', minHeight: '0', padding: '2rem' }}
      >
        <Stack spacing={1}>
          <Button theme="create">
            <Icon name="add" size={24} color="#709DA0" />
            Create new version
          </Button>
          {versions?.map((version) => (
            <Paper key={`${version.uid}-${version?.version?.current}`} spacing={1} padding={2} theme="light">
              <Stack direction="row" spacing={2}>
                <Typography variant="h5">{version.name}</Typography>
                <Chip style={{ fontSize: '1rem' }}>v{version?.version?.current}</Chip>
                {version?.version?.tags?.includes('latest') && <Chip style={{ fontSize: '1rem' }}>Latest</Chip>}
                {document?.version?.current === version?.version?.current && (
                  <Chip variant="active" style={{ fontSize: '1rem' }}>
                    Currently viewing
                  </Chip>
                )}
              </Stack>
              <Typography variant="caption">
                {moment(version?.timestamp).format('MMMM Do YYYY, H:mm:ss')} by {version?.modifiedBy}
              </Typography>
              <Typography variant="body_short">{version?.description}</Typography>
              {document?.version?.current !== version?.version?.current && (
                <Stack direction="row" spacing={2}>
                  <Link
                    target="_blank"
                    to={
                      document?.type === 'workflow'
                        ? `/workspace/${document?.workspace}/workflow/${document?.uid}/${version?.version?.current}`
                        : `/component/${document?.uid}/${version?.version?.current}`
                    }
                  >
                    <Button as="span" theme="simple">
                      <Icon name="visibility" />
                      View workflow v{version?.version?.current}
                    </Button>
                  </Link>
                </Stack>
              )}
            </Paper>
          ))}
          <Pagination
            totalItems={pageInfo?.totalNumber}
            itemsPerPage={10}
            withItemIndicator
            onChange={(event, page) => fetchVersions(undefined, { offset: (page - 1) * 10, limit: 10 }, undefined)}
          />
        </Stack>
      </Grid>
      <Grid item xs={4} sx={{ flexGrow: '1', overflowY: 'auto', minHeight: '0' }}>
        <Stack padding="2rem" spacing={2} justifyContent="space-between" sx={{ minHeight: '100%' }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack spacing={2} sx={{ flexGrow: '1' }}>
              {editName ? (
                <TextField autoFocus defaultValue={document?.name} onBlur={(event) => updateName(event)} />
              ) : (
                <StyledTextButton onClick={() => setEditName(true)}>
                  <Typography variant="h3">{document?.name}</Typography>
                </StyledTextButton>
              )}
              {editDescription ? (
                <TextField
                  autoFocus
                  multiline
                  rows={3}
                  defaultValue={document?.description}
                  onBlur={(event) => updateDescription(event)}
                />
              ) : (
                <StyledTextButton onClick={() => setEditDescription(true)}>
                  <Typography variant="body_long">{document?.description || '+ add description'}</Typography>
                </StyledTextButton>
              )}
              <Typography variant="body_long">
                <b>Author</b> <br /> {document?.modifiedBy}
              </Typography>
              {document?.type === 'workflow' && (
                <Typography variant="body_long">
                  <b>Workspace</b> <br /> {document?.workspace}
                </Typography>
              )}
              <Typography variant="body_long">
                <b>Last modified</b> <br /> {moment(document?.timestamp).format('MMMM Do YYYY, H:mm:ss')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body_long">
                  <b>Tags</b>
                </Typography>
                <Stack direction="row">
                  {document?.version?.tags?.map((tag) => (
                    <Chip key={tag} style={{ fontSize: '1rem' }}>
                      {tag}
                    </Chip>
                  ))}
                  <Chip variant="active" onClick={() => null} style={{ fontSize: '1rem' }}>
                    <Icon name="add" size={16} color="#709DA0" /> Add tag
                  </Chip>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button theme="danger">
              <Icon name="delete_to_trash" />
              Delete {document?.type}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
