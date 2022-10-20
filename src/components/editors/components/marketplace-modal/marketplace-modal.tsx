import React, { FC, useState } from 'react';
import { Dialog, DialogContent, Stack } from '@mui/material';
import { Icon } from '@equinor/eds-core-react';
import { Marketplace } from '../../../marketplace/marketplace';
import { Component } from '../../../../models/v2';
import { BUTTON_STATE } from '../../../creators/add-component-to-graph';
import { DialogWrapper, Button, MultiToggle, ToggleButton } from '../../../ui';
import { FunctionalComponents } from '../functional-components/functional-components';

interface MarketplaceModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onAddComponent: (component: Component, setButtonState: React.Dispatch<React.SetStateAction<BUTTON_STATE>>) => void;
  component: Component | undefined;
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
  subcomponents: Component[] | undefined;
}

export const MarketplaceModal: FC<MarketplaceModalProps> = (props: MarketplaceModalProps) => {
  const { open, onClose, onAddComponent } = props;
  const [type, setType] = useState<'marketplace' | 'functional'>('marketplace');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogWrapper>
        <DialogContent sx={{ height: '90vh' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: '1rem' }}>
            <MultiToggle style={{ fontSize: '1.25rem' }}>
              <ToggleButton active={type === 'marketplace'} onClick={() => setType('marketplace')}>
                <Icon name="mall" /> Marketplace components
              </ToggleButton>
              <ToggleButton active={type === 'functional'} onClick={() => setType('functional')}>
                <Icon name="formula" /> Functional components
              </ToggleButton>
            </MultiToggle>
            <Button theme="icon" onClick={() => onClose(false)}>
              <Icon name="close" />
            </Button>
          </Stack>
          <Stack sx={{ padding: '2rem 2rem 2rem' }}>
            {type === 'marketplace' ? (
              <Marketplace onAddComponent={onAddComponent} showTitle={false} />
            ) : (
              <FunctionalComponents
                onClose={onClose}
                component={props.component}
                subComponents={props.subcomponents}
                setComponent={props.setComponent || (() => null)}
              />
            )}
          </Stack>
        </DialogContent>
      </DialogWrapper>
    </Dialog>
  );
};
