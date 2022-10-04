import React, { FC } from 'react';
import { Icon, Tooltip, Typography } from '@equinor/eds-core-react';
import { Handle, NodeProps, Position } from 'react-flow-renderer/nocss';
import { INode } from '../../helpers/helpers';
import { Storage } from '@mui/icons-material';

interface IEndNode extends NodeProps<INode> {}

export const EndNode: FC<IEndNode> = (props: IEndNode) => {
  const { data } = props;

  const ICON = {
    parameter: 'swap_horizontal',
    artifact: 'file',
    env_secret: 'security',
    parameter_array: 'list',
  };

  return (
    <div className="react-flow__node-endNode__wrapper">
      <Typography variant="body_short_bold">
        {data?.type === 'volume' ? (
          <Storage sx={{ color: '#999' }} />
        ) : (
          <Icon name={data?.type ? ICON[data?.type as keyof typeof ICON] : 'swap_horizontal'} color="#999" />
        )}{' '}
        <b>{data?.label}</b>
      </Typography>
      <Tooltip title={`Output | Type: ${data?.type}`} style={{ fontSize: '1rem' }}>
        <Handle
          type="target"
          id={props.id}
          key={`o-${props.id}`}
          position={Position.Left}
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
};
