import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { MenuButton } from './menu-button/menu-button';
import { EditorMenuProps } from './types';
import { StyledEditorMenu } from './styles';

export const EditorMenu: FC<EditorMenuProps> = (props: EditorMenuProps) => {
  const { active, setActive, isWorkflow } = props;
  return (
    <StyledEditorMenu alignItems="stretch" justifyContent="space-between" spacing={1}>
      <Stack spacing={0.5}>
        <MenuButton
          disabled={!props.dirty || !(props.errorsLength === 0)}
          create
          onClick={props.onSave}
          icon="save"
          label="Save"
        />
        <MenuButton
          onClick={props.openValidation}
          label={`${props.errorsLength} Errors`}
          icon="error_outlined"
          danger={(props.errorsLength || 0) > 0}
        />
      </Stack>
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
    </StyledEditorMenu>
  );
};

EditorMenu.defaultProps = {
  errorsLength: 0,
};
