import React, { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { Tooltip, Button, Menu, Icon, Typography } from '@equinor/eds-core-react';
import { EditorSettings, MarketplaceModal, FunctionalComponents } from '.';
import { Component } from '../../../models/v2';

interface EditorCentralBarProps {
  setUseManifest?: any;
  onAddComponent?: any;
  type?: string;
  component?: Component;
  subComponents?: Component[];
  setComponent?: any;
}

export const EditorCentralBar: FC<EditorCentralBarProps> = (props: EditorCentralBarProps) => {
  const { type } = props;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const [marketplaceOpen, setMarketplaceOpen] = useState<boolean>(false);
  const [functionalComponentsOpen, setFunctionalComponentsOpen] = useState<boolean>(false);

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '70px', height: '100%', background: '#F7F7F7', padding: '1rem 0' }}
    >
      <div />
      <Stack spacing={1}>
        {type !== 'job' && (
          <>
            <Tooltip
              title={type === 'graph' ? 'Add component' : 'Implementation needs to be a graph'}
              style={{ fontSize: '1rem' }}
            >
              <Button
                onClick={() => setMenuOpen(true)}
                variant="ghost_icon"
                // @ts-ignore
                ref={setAnchorEl}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="add-menu"
                style={{ flexShrink: '0' }}
                disabled={!(type === 'graph')}
              >
                <Icon name="add" />
              </Button>
            </Tooltip>

            <MarketplaceModal
              open={marketplaceOpen}
              onClose={() => setMarketplaceOpen(false)}
              onAddComponent={props.onAddComponent}
            />
            <FunctionalComponents
              open={functionalComponentsOpen}
              setOpen={setFunctionalComponentsOpen}
              component={props.component}
              subComponents={props.subComponents}
              setComponent={props.setComponent}
            />
            <Menu
              id="add-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              placement="right"
              onClose={() => setMenuOpen(false)}
            >
              <Menu.Item onClick={() => setMarketplaceOpen(true)}>
                <Icon name="mall" size={16} color="#666" />
                <Typography group="navigation" variant="menu_title" as="span">
                  Add marketplace component
                </Typography>
              </Menu.Item>
              <Menu.Item onClick={() => setFunctionalComponentsOpen(true)}>
                <Icon name="formula" size={16} color="#666" />
                <Typography group="navigation" variant="menu_title" as="span">
                  Add functional component
                </Typography>
              </Menu.Item>
            </Menu>
          </>
        )}
        <EditorSettings />
        <Tooltip title="Toggle manifest" style={{ fontSize: '1rem' }}>
          <Button variant="ghost_icon" onClick={() => props.setUseManifest((prev: boolean) => !prev)}>
            <Icon name="code" />
          </Button>
        </Tooltip>
      </Stack>
      <Button variant="ghost_icon">
        <Icon name="first_page" size={24} />
      </Button>
    </Stack>
  );
};
