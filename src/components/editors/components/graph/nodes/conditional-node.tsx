import React, { memo, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { NodeProps } from 'react-flow-renderer/nocss';
import { INode } from '../../../helpers/helpers';
import { Handles } from '..';
import { NodePreview } from '../..';
import { Conditional } from '../../../../../models/v2';
import { Stack, Button, Chip } from '../../../../ui';

interface IConditionalNode extends NodeProps<INode> {}

export const ConditionalNode = memo((props: IConditionalNode) => {
  const { data } = props;
  const [open, setOpen] = useState<boolean>(false);

  console.log(data?.component);

  //const trueNode = (data?.component?.implementation as Conditional)?.nodeTrue;
  const falseNode = (data?.component?.implementation as Conditional)?.nodeFalse;

  return (
    <>
      <Handles parameters={data?.component?.inputs} type="Input" />
      <div>
        <Stack className="react-flow__node-mapNode--internal" spacing={2} direction="row" alignItems="center">
          <NodePreview node={props} open={open} onClose={setOpen} />
          <Stack alignItems="center" spacing={3} direction="row">
            <Stack spacing={1} alignItems="space-between">
              <Icon name="formula" size={16} color="#0084c4" />
              <div>
                <Typography variant="body_short_bold">{falseNode ? 'If/else' : 'If'}</Typography>
              </div>
              <Stack direction="row" alignItems="center">
                <Chip>{data?.component?.implementation?.type}</Chip>
              </Stack>
              <Button theme="simple" onClick={() => data.setConfigComponent({ id: props.id, type: 'if' })}>
                <Icon name="tune" />
                Configure conditional
              </Button>
            </Stack>
            <Icon name="drag_indicator" className="custom-drag-handle" size={32} />
          </Stack>
        </Stack>
      </div>
      <Handles parameters={data?.component?.outputs} type="Output" />
    </>
  );
});
