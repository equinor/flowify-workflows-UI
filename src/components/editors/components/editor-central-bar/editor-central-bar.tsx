// @ts-nocheck
import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { Tooltip, Icon } from '@equinor/eds-core-react';
import { EditorSettings } from '..';
import { Button } from '../../../ui';

interface EditorCentralBarProps {
  setUseManifest?: any;
}

export const EditorCentralBar: FC<EditorCentralBarProps> = (props: EditorCentralBarProps) => {
  return (
    <Stack alignItems="center" justifyContent="space-between" sx={{ width: '70px', height: '100%', padding: '1rem 0' }}>
      <div />
      <Stack spacing={1} alignItems="center">
        <EditorSettings />
        <Tooltip title="Toggle manifest" style={{ fontSize: '1rem' }}>
          <Button theme="icon" onClick={() => props.setUseManifest((prev: boolean) => !prev)}>
            <Icon name="code" />
          </Button>
        </Tooltip>
        <Button theme="icon">
          <Icon name="first_page" size={24} />
        </Button>
      </Stack>
    </Stack>
  );
};
