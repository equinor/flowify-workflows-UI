import React, { memo } from 'react';
import { Icon, Tooltip, Typography } from '@equinor/eds-core-react';
import { Handle, Position, NodeProps } from 'react-flow-renderer/nocss';
import { INode } from '../../../helpers';

interface IStartNode extends NodeProps<INode> {}

export const StartNode = memo((props: IStartNode) => {
  const { data } = props;

  const ICON = {
    parameter: 'swap_horizontal',
    artifact: 'file',
    env_secret: 'security',
    parameter_array: 'list',
    volume: 'storage',
  };

  return (
    <div className="react-flow__node-startNode__wrapper">
      <Typography variant="body_short_bold">
        <Icon name={data?.type ? ICON[data?.type as keyof typeof ICON] : 'swap_horizontal'} color="#999" />
        <b>{data?.label}</b>
      </Typography>
      <Tooltip title={`Input | Type: ${data?.type}`} style={{ fontSize: '1rem' }}>
        <Handle
          type="source"
          id={`${props.id}`}
          key={`i-${props.id}`}
          position={Position.Right}
          isConnectable
          style={{
            height: 10,
            width: 10,
            borderWidth: 1,
            transform: 'none',
          }}
        />
      </Tooltip>
    </div>
  );
});
