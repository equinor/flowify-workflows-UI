import React, { memo, useState } from 'react';
import { Button, Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { NodeProps } from 'react-flow-renderer/nocss';
import { DragIndicator as DragIcon } from '@mui/icons-material';
import { INode } from '../../helpers/helpers';
import { Handles } from '.';
import { NodePreviewModal } from '../node-previews/node-preview-modal';
import { Conditional } from '../../../../models/v2';

interface IConditionalNode extends NodeProps<INode> {}

export const ConditionalNode = memo((props: IConditionalNode) => {
  const { data } = props;
  const [open, setOpen] = useState<boolean>(false);

  console.log(data?.component);

  //const trueNode = (data?.component?.implementation as Conditional)?.nodeTrue;
  const falseNode = (data?.component?.implementation as Conditional)?.nodeFalse;

  //const childNode = typeof childRef === 'string' ? data?.subcomponents?.find((comp) => comp.uid === childRef) : childRef;

  return (
    <>
      <Handles parameters={data?.component?.inputs} type="Input" />
      <div>
        <Button variant="ghost" onClick={() => data.setConfigComponent({ id: props.id, type: 'if' })}>
          Configure if
        </Button>
        <Stack className="react-flow__node-mapNode--internal" spacing={2} direction="row" alignItems="center">
          <NodePreviewModal node={props} open={open} onClose={setOpen} />
          <Stack alignItems="center" spacing={3} direction="row">
            <Stack spacing={1} alignItems="space-between">
              <Icon name="formula" size={16} color="#999" />
              <div>
                <Typography variant="body_short_bold">{falseNode ? 'If/else' : 'If'}</Typography>
                <Typography variant="body_short" style={{ maxWidth: '280px' }}>
                  {data?.component?.description}
                </Typography>
              </div>
              <Stack direction="row" alignItems="center">
                <Chip>{data?.component?.implementation?.type}</Chip>
              </Stack>
            </Stack>
            <DragIcon className="custom-drag-handle" sx={{ color: '#666', fontSize: '2rem' }} />
          </Stack>
        </Stack>
      </div>
      <Handles parameters={data?.component?.outputs} type="Output" />
    </>
  );
});
