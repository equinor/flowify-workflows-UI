import React, { FC, useState } from 'react';
import { Icon } from '@equinor/eds-core-react';
import { Component } from '@models/v2';
import { DialogWrapper, Button, MultiToggle, ToggleButton, Stack, Modal } from '@ui';
import { Marketplace } from '../../../marketplace/marketplace';
import { BUTTON_STATE } from '../../../marketplace/add-button/add-button';
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
    <Modal open={open} onClose={() => onClose(false)} fullWidth maxWidth="xl">
      <DialogWrapper padding={1} style={{ height: '90vh' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" padding={1}>
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
        <Stack style={{ padding: '2rem 2rem 2rem' }}>
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
      </DialogWrapper>
    </Modal>
  );
};
