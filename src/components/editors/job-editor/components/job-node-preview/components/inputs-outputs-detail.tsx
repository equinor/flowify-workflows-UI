import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Stack } from '@ui';
import { Outputs, NodeStatus, Workflow, Inputs } from '../../../../../../models';
import { ArtifactsDetail, ParametersDetail } from '.';

interface IInputsOutputsDetail {
  workflow: Workflow;
  node: NodeStatus;
  outputs?: Outputs;
  inputs?: Inputs;
}
export const InputsOutputsDetail: FC<IInputsOutputsDetail> = (props: IInputsOutputsDetail) => {
  const { inputs, workflow, node, outputs } = props;
  return (
    <Stack spacing={1}>
      <Typography variant="h4">Inputs</Typography>
      <ParametersDetail parameters={inputs?.parameters} />
      <ArtifactsDetail workflow={workflow} node={node} isInput artifacts={inputs?.artifacts} />
      <Typography variant="h4">Outputs</Typography>
      <ParametersDetail parameters={outputs?.parameters} />
      <ArtifactsDetail workflow={workflow} node={node} isInput={false} artifacts={outputs?.artifacts} />
    </Stack>
  );
};

InputsOutputsDetail.defaultProps = {
  inputs: undefined,
  outputs: undefined,
};
