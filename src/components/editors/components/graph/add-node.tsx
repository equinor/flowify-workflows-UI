import { Icon, Typography } from '@equinor/eds-core-react';
import React from 'react';
import { NodeProps } from 'react-flow-renderer/nocss';
import { INode } from '../../helpers/helpers';

interface AddNodeProps extends NodeProps<INode> {}

export const AddNode = (props: AddNodeProps) => {
  const { data, id } = props;
  return (
    <button onClick={() => data?.setConfigComponent(id)}>
      <Icon name="add" /> <Typography variant="h5">{data?.label}</Typography>
    </button>
  );
};
