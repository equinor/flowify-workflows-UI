import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { isNotEmptyArray } from '@common';
import { Stack } from '@ui';
import { BaseInput } from '@form';

interface LogViewerProps {
  logs: string[];
}

export const LogViewer: FC<LogViewerProps> = (props: LogViewerProps) => {
  const { logs } = props;
  return isNotEmptyArray(logs) ? (
    <Stack spacing={0.5}>
      <Typography variant="h4">Logs</Typography>
      <BaseInput name="logs" multiline rows={3} value={logs.join('\n')} spellCheck={false} />
    </Stack>
  ) : null;
};
