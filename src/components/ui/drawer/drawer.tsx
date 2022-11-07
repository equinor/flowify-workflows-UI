import React, { FC } from 'react';
import Modal, { Styles } from 'react-modal';

const MAX_WIDTHS = {
  sm: '640px',
  md: '770px',
  lg: '1280px',
  xl: '1440px',
};

interface DrawerProps {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  maxWidth?: keyof typeof MAX_WIDTHS;
}

export const Drawer: FC<DrawerProps> = (props: DrawerProps) => {
  const { open, onClose, maxWidth, ...restProps } = props;

  const styles: Styles = {
    overlay: { background: 'rgba(0, 0, 0, 0.4)' },
    content: {
      right: 0,
      left: 'auto',
      height: '100%',
      top: 0,
      bottom: 0,
      width: '100%',
      maxWidth: maxWidth ? MAX_WIDTHS[maxWidth] : 'none',
      padding: 0,
      border: 0,
    },
  };

  return <Modal isOpen={open} onRequestClose={onClose} style={styles} {...restProps} closeTimeoutMS={500} />;
};
