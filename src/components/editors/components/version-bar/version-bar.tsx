import React, { FC } from 'react';
import { Button, Chip, Icon } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { Select } from '../../../ui';

interface VersionBarProps {
  version: number | undefined;
  isLatest: boolean;
  onSave: () => void;
  onPublish: () => void;
}

export const VersionBar: FC<VersionBarProps> = (props: VersionBarProps) => {
  const { version, onSave, onPublish } = props;

  const versionsOptions = Array.from({ length: version || 0 }, (_, i) => i + 1).map((count) => ({
    label: `Version ${count}`,
    value: `${count}`,
  }));

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ background: 'white', padding: '1rem' }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip style={{ fontSize: '1rem' }}>
          <span>
            v{version} {props.isLatest ? '(Latest version)' : ''}
          </span>
        </Chip>
        <Select id="version_selector" options={versionsOptions} onChange={null} value={`${version}`} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button onClick={onSave}>
          <Icon name="save" /> Save changes
        </Button>
        <Button color="secondary" onClick={onPublish}>
          Create new version
        </Button>
      </Stack>
    </Stack>
  );
};
