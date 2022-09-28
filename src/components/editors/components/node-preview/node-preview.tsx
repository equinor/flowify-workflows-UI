import React, { FC } from 'react';
import { Drawer, Stack } from '@mui/material';
import { NodeProps } from 'react-flow-renderer/nocss';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { INode } from '../../helpers/helpers';
import { Brick, Graph } from '../../../../models/v2';

interface NodePreviewProps {
  open: boolean;
  onClose: (open: boolean) => void;
  node: NodeProps<INode>;
}

export const NodePreview: FC<NodePreviewProps> = (props: NodePreviewProps) => {
  const { node, onClose } = props;
  const { data, type } = node;
  const inputParams = data?.component?.inputs || [];
  const outputParams = data?.component?.outputs || [];
  return (
    <Drawer open={props.open} onClose={() => onClose(false)} anchor="right" sx={{ width: '400px' }}>
      <Stack spacing={2} sx={{ padding: '2rem', width: '440px' }}>
        <Typography variant="h4">
          <b>{data?.label}</b>
        </Typography>
        <Typography variant="body_short">{data?.component?.description}</Typography>
        {data?.component?.modifiedBy && (
          <Stack spacing={1}>
            <Typography variant="body_short_bold">Author</Typography>
            <Typography variant="body_short_link">
              <a href={`mailto: ${data?.component?.modifiedBy?.email}`}>{data?.component?.modifiedBy?.email}</a>
            </Typography>
          </Stack>
        )}
        <Stack spacing={1}>
          <Typography variant="body_short_bold">Node Id</Typography>
          <code>{node?.id}</code>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body_short_bold">Published</Typography>
          <code>{moment(data?.component?.timestamp).format('MMMM Do YYYY, H:mm:ss')}</code>
        </Stack>
        {type === 'taskNode' && (
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="body_short_bold">Inputs</Typography>
              {Array.isArray(inputParams) && inputParams.length > 0 ? (
                <ReactJson src={inputParams} name="inputs" collapsed displayDataTypes={false} />
              ) : (
                <Typography variant="body_short">No input parameters</Typography>
              )}
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body_short_bold">Outputs</Typography>
              {Array.isArray(outputParams) && outputParams.length > 0 ? (
                <ReactJson src={outputParams} name="outputs" collapsed displayDataTypes={false} />
              ) : (
                <Typography variant="body_short">No output parameters</Typography>
              )}
            </Stack>
            <Stack spacing={1}>
              <Typography variant="body_short_bold">Implementation type</Typography>
              <code>{data?.implementation?.type}</code>
            </Stack>
            {data?.implementation?.type === 'brick' && (
              <>
                <Stack spacing={1}>
                  <Typography variant="body_short_bold">Container</Typography>
                  <ReactJson
                    src={(data?.implementation as Brick)?.container || {}}
                    name="container"
                    collapsed
                    displayDataTypes={false}
                  />
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="body_short_bold">Arguments</Typography>
                  <ReactJson
                    src={(data?.implementation as Brick)?.args || {}}
                    name="args"
                    collapsed
                    displayDataTypes={false}
                  />
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="body_short_bold">Results</Typography>
                  <ReactJson
                    src={(data?.implementation as Brick)?.results || {}}
                    name="results"
                    collapsed
                    displayDataTypes={false}
                  />
                </Stack>
              </>
            )}
            {data?.implementation?.type === 'graph' && (
              <>
                <Stack spacing={1}>
                  <Typography variant="body_short_bold">Nodes</Typography>
                  <ReactJson
                    src={(data?.implementation as Graph)?.nodes || {}}
                    name="nodes"
                    collapsed
                    displayDataTypes={false}
                  />
                </Stack>
              </>
            )}
          </Stack>
        )}
        <Stack alignItems="flex-end" sx={{ paddingTop: '2rem' }}>
          {!node.data?.isInlineComponent && (
            <Link to={`/component/${data?.component?.uid}`} target="_blank">
              <Button as="span" color="secondary">
                <Icon name="code" /> View component source
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
