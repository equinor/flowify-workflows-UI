import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { MenuButton } from './components/menu-button';

type ActiveType = 'editor' | 'document' | 'runs';
interface EditorMenuProps {
  active: ActiveType;
  setActive: (type: ActiveType) => void;
  isWorkflow?: boolean;
  onSave: () => void;
  dirty: boolean;
}

export const EditorMenu: FC<EditorMenuProps> = (props: EditorMenuProps) => {
  const { active, setActive, isWorkflow } = props;
  return (
    <Stack
      alignItems="stretch"
      justifyContent="space-between"
      spacing={1}
      sx={{ backgroundColor: '#ADE2E619', padding: '0.25rem' }}
    >
      <MenuButton disabled={!props.dirty} create onClick={props.onSave} icon="save" label="Save" />
      <Stack spacing={0.5}>
        <MenuButton
          active={active === 'editor'}
          onClick={() => setActive('editor')}
          icon="tag_relations"
          label="Build"
        />
        <MenuButton
          active={active === 'document'}
          onClick={() => setActive('document')}
          icon="file"
          label={isWorkflow ? 'Workflow' : 'Component'}
        />
        {isWorkflow && (
          <MenuButton active={active === 'runs'} onClick={() => setActive('runs')} icon="launch" label="Jobs" />
        )}
      </Stack>
      <div />
    </Stack>
  );
};
