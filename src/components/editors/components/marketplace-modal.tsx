import React, { FC } from 'react';
import { Dialog, DialogContent, Stack } from '@mui/material';
import { Button, Icon } from '@equinor/eds-core-react';
import { Marketplace } from '../../marketplace/marketplace';

interface MarketplaceModalProps {
  open: boolean;
  onClose: any;
  onAddComponent: any;
}

export const MarketplaceModal: FC<MarketplaceModalProps> = (props: MarketplaceModalProps) => {
  const { open, onClose, onAddComponent } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogContent sx={{ height: '90vh' }}>
        <Stack alignItems="flex-end" sx={{ padding: '1rem' }}>
          <Button variant="ghost_icon" onClick={() => onClose(false)}>
            <Icon name="close" />
          </Button>
        </Stack>
        <Stack sx={{ padding: '0 2rem 2rem' }}>
          <Marketplace onAddComponent={onAddComponent} showTitle={false} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
