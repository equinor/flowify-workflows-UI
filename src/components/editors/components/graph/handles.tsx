import React, { FC } from 'react';
import { Handle, Position } from 'react-flow-renderer/nocss';
import { Tooltip } from '@equinor/eds-core-react';
import { Data } from '@models/v2';
import { Stack } from '@ui';

interface IHandles {
  parameters?: Data[];
  type: 'Input' | 'Output';
  filterParameters?: boolean;
}

export const Handles: FC<IHandles> = (props: IHandles) => {
  const { parameters, type, filterParameters } = props;

  const style = type === 'Input' ? { marginLeft: '-1rem' } : { marginRight: '-1rem' };

  return (
    <Stack spacing={1} style={style}>
      {parameters
        ? parameters
            .filter((param) => param.name)
            .filter((param) => (filterParameters ? param.type !== 'env_secret' && param.type !== 'volume' : true))
            .map((parameter) => (
              <Tooltip
                key={`p-${type}-${parameter.name}`}
                title={`${type}: ${parameter.name} | type: ${parameter.type}`}
                style={{ fontSize: '1rem' }}
              >
                <Handle
                  type={type === 'Input' ? 'target' : 'source'}
                  id={`p-${parameter.name}`}
                  position={type === 'Input' ? Position.Left : Position.Right}
                  isConnectable
                  style={{ position: 'relative' }}
                />
              </Tooltip>
            ))
        : null}
    </Stack>
  );
};

Handles.defaultProps = {
  filterParameters: true,
};
