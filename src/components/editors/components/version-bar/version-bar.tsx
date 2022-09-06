import React, { FC, useState } from 'react';
import { Button, Chip, Icon } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { History } from '../../workflow/components';

interface VersionBarProps {
  version: number | undefined;
  isLatest: boolean;
  onSave: () => void;
  onPublish: () => void;
  type: 'component' | 'workflow';
}

export const VersionBar: FC<VersionBarProps> = (props: VersionBarProps) => {
  const { version, onSave, onPublish } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  /**
   * TODO: Add api call to fetch versions overview - this is temporary hack
   */
  const versions = Array.from({ length: version || 0 }, (_, i) => i + 1);

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
        <Button variant="ghost_icon" onClick={() => setModalOpen(true)}>
          <Icon name="history" />
        </Button>
        <History
          type={props.type}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          versions={versions}
          currentVersion={version}
        />
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
