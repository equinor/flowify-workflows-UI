import React, { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { Tooltip, Button, Menu, Icon, Typography } from '@equinor/eds-core-react';
import { EditorSettings, MarketplaceModal, FunctionalComponents } from '.';
import { Component, Graph } from '../../../models/v2';
import { nanoid } from '../helpers';
import { services } from '../../../services/v2';
import { FeedbackTypes } from './feedbacks/feedbacks';

interface EditorCentralBarProps {
  setUseManifest?: any;
  type?: string;
  component?: Component | undefined;
  subComponents?: Component[];
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setSubcomponents?: React.Dispatch<React.SetStateAction<Component[] | undefined>>;
  setFeedback?: (message: FeedbackTypes) => void;
}

export const EditorCentralBar: FC<EditorCentralBarProps> = (props: EditorCentralBarProps) => {
  const { type, setSubcomponents, setFeedback, setComponent } = props;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const [marketplaceOpen, setMarketplaceOpen] = useState<boolean>(false);
  const [functionalComponentsOpen, setFunctionalComponentsOpen] = useState<boolean>(false);

  async function onAddComponent(component: Component, setButtonState: any) {
    const { uid } = component;
    if (uid && setSubcomponents && setFeedback && setComponent) {
      services.components
        .get(uid)
        .then((res) => setSubcomponents((prev) => [...(prev || []), res]))
        .then(() => {
          setButtonState('success');
          setFeedback('MARKETPLACE_SUCCESS');
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        })
        .then(() => {
          setComponent((prev) => ({
            ...prev,
            implementation: {
              ...prev?.implementation,
              nodes: [...((prev?.implementation as Graph)?.nodes || []), { id: `n${nanoid(8)}`, node: uid }],
            },
          }));
        })
        .catch((error) => {
          console.error(error);
          setFeedback('MARKETPLACE_ERROR');
          setButtonState('error');
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        });
    }
  }

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
              onAddComponent={onAddComponent}
            />
            <FunctionalComponents
              open={functionalComponentsOpen}
              setOpen={setFunctionalComponentsOpen}
              component={props.component}
              subComponents={props.subComponents}
              setComponent={setComponent || (() => null)}
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
