import React from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Stack } from '@ui';
import { Parameter } from '../../../../../../models';

interface ParametersProps {
  parameters?: Parameter[];
}
export const ParametersDetail: React.FC<ParametersProps> = ({ parameters }: ParametersProps) => {
  return (
    <Stack>
      <Typography variant="h6">Parameters</Typography>
      {parameters === undefined || parameters?.length === 0 ? (
        <Typography variant="body_short">No parameters</Typography>
      ) : (
        <Stack spacing={0.5} style={{ marginTop: '0.5rem' }}>
          {parameters.map((parameter) => (
            <Stack
              key={parameter.name}
              spacing={0.5}
              style={{ borderLeft: '3px solid #007079', padding: '0.5rem 1rem' }}
            >
              <Typography variant="body_short">
                <b>Name: </b>
                {parameter.name}
              </Typography>
              <Typography variant="body_short" style={{ wordBreak: 'break-word' }}>
                <b>Value: </b>
                {parameter.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
