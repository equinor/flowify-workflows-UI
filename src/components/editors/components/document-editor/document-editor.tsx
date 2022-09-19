import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Chip, Icon, Pagination, Typography } from '@equinor/eds-core-react';
import { Dialog, Grid, TextField as MUITextField } from '@mui/material';
import moment from 'moment';
import { Workflow, Component, WorkflowListRequest, ComponentListRequest } from '../../../../models/v2';
import { Button, Paper, TextField, Stack } from '../../../ui';
import { Link } from 'react-router-dom';
import { IFilter, IPagination } from '../../../../services/v2';

interface DocumentEditorProps {
  document: Workflow | Component | undefined;
  setInstance: any;
  versionsResponse?: WorkflowListRequest | ComponentListRequest | undefined;
  onPublish: () => void;
  onDelete: () => void;
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
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');

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

  function tagEventHandler(event: any) {
    function addTag(list: string[] | undefined) {
      if (!list) {
        return [tagInput];
      }
      list.push(tagInput);
      return list;
    }
    if (event.key === 'Enter' && tagInput) {
      setInstance((prev: Component | Workflow) => ({
        ...prev,
        version: {
          ...prev?.version,
          tags: addTag(prev?.version?.tags),
        },
      }));
      setTagInput('');
    }
  }

  function removeTagFromList(list: string[] | undefined, value: string) {
    return list?.filter((tag) => tag !== value) || [];
  }

  function removeTag(value: string) {
    setInstance((prev: Component | Workflow) => ({
      ...prev,
      version: {
        ...prev?.version,
        tags: removeTagFromList(prev?.version?.tags, value),
      },
    }));
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
        <Stack padding={2} spacing={2} justifyContent="space-between" style={{ minHeight: '100%' }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack spacing={1} grow={1}>
              {editName ? (
                <MUITextField autoFocus defaultValue={document?.name} onBlur={(event: any) => updateName(event)} />
              ) : (
                <StyledTextButton onClick={() => setEditName(true)}>
                  <Typography variant="h3">{document?.name}</Typography>
                </StyledTextButton>
              )}
              {editDescription ? (
                <MUITextField
                  autoFocus
                  multiline
                  rows={3}
                  defaultValue={document?.description}
                  onBlur={(event: any) => updateDescription(event)}
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
                <div>
                  <Stack direction="row" spacing={1} wrap="wrap">
                    {document?.version?.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        style={{ fontSize: '1rem', marginBottom: '1rem' }}
                        onDelete={tag === 'latest' ? undefined : () => removeTag(tag)}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </Stack>
                  <TextField
                    icon="add"
                    id="add_tag"
                    name="add_tag"
                    onKeyDown={tagEventHandler}
                    onChange={(event: any) => setTagInput(event.target.value)}
                    value={tagInput}
                    placeholder="Add tag and press Enter"
                  />
                </div>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button theme="danger" onClick={() => setDeleteModalOpen(true)}>
              <Icon name="delete_to_trash" />
              Delete {document?.type}
            </Button>
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
              <Stack padding={2} spacing={3}>
                <Typography variant="body_long">
                  Are you sure you want to delete {document?.type} "{document?.name}"?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button theme="simple" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button theme="danger" onClick={props.onDelete}>
                    Delete {document?.type}
                  </Button>
                </Stack>
              </Stack>
            </Dialog>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
