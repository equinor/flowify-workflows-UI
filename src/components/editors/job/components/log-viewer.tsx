import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { isNotEmptyArray } from '../../../../common';
import { Stack, TextField } from '@mui/material';

interface LogViewerProps {
  logs: string[];
}

export const LogViewer: FC<LogViewerProps> = (props: LogViewerProps) => {
  const { logs } = props;
  return isNotEmptyArray(logs) ? (
    <Stack spacing={1}>
      <Typography variant="h4">Logs</Typography>
      <TextField size="small" multiline minRows={3} maxRows={8} fullWidth value={logs.join('\n')} spellCheck={false} />
    </Stack>
  ) : null;
};
