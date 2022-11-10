import React from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { NodeProps } from 'react-flow-renderer/nocss';
import { IGraphNode } from '@models/v2';

interface AddNodeProps extends NodeProps<IGraphNode> {}

export const AddNode = (props: AddNodeProps) => {
  const { data, id } = props;
  return (
    <button onClick={() => data?.setConfigComponent(id)}>
      <Icon name="add" /> <Typography variant="h5">{data?.label}</Typography>
    </button>
  );
};
