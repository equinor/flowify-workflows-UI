import React, { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { Radio, Typography } from '@equinor/eds-core-react';
import { Component, Graph } from '../../../../../models/v2';

interface IfCreatorProps {
  component: Component | undefined;
  subcomponents: Component[] | undefined;
}

export const IfCreator: FC<IfCreatorProps> = (props: IfCreatorProps) => {
  const { component, subcomponents } = props;

  const [trueNode, setTrueNode] = useState();
  const [falseNode, setFalseNode] = useState();

  return (
    <Stack sx={{ padding: '2rem' }} spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Select component to run if expression is true</Typography>
        <Stack direction="row" spacing={2}>
          {component?.implementation?.type === 'graph' &&
            (component.implementation as Graph).nodes?.map((node) => (
              <Radio
                key={node?.id}
                label={
                  typeof node.node === 'string'
                    ? subcomponents?.find((component) => component.uid === node.node)?.name
                    : node.node?.name || node.id
                }
                value={node?.id}
                checked={trueNode === node?.id}
                onChange={(event: any) => setTrueNode(event.target.value)}
              />
            ))}
        </Stack>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="h6">Select component to run if expression is false</Typography>
        <Stack direction="row" spacing={2}>
          {component?.implementation?.type === 'graph' &&
            (component.implementation as Graph).nodes?.map((node) => (
              <Radio
                key={node?.id}
                label={
                  typeof node.node === 'string'
                    ? subcomponents?.find((component) => component.uid === node.node)?.name
                    : node.node?.name || node.id
                }
                value={node?.id}
                checked={falseNode === node?.id}
                onChange={(event: any) => setFalseNode(event.target.value)}
              />
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
