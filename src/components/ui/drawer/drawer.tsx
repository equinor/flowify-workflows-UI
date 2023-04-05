import React, { FC } from 'react';
import { Drawer as DrawerOPT } from '@equinor/opt-ui-core';

interface DrawerProps {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  width?: number | string;
}

export const Drawer: FC<DrawerProps> = (props: DrawerProps) => {
  const { width = 600, children } = props;
  return <DrawerOPT variant='temporary' placement='right' css={{ width }} initialFullScreen {...props}>{children}</DrawerOPT>
};
