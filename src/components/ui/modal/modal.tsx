import React, { FC } from 'react';
import ReactModal, { Styles } from 'react-modal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const MAX_WIDTHS = {
  sm: '640px',
  md: '770px',
  lg: '1280px',
  xl: '1440px',
};

export const Modal: FC<ModalProps> = (props: ModalProps) => {
  const { open, onClose, fullWidth, maxWidth, ...restProps } = props;

  const customStyles: Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0',
      border: 'none',
      boxShadow: 'none',
      background: 'none',
      width: fullWidth ? '100%' : 'auto',
      maxWidth: maxWidth ? MAX_WIDTHS[maxWidth] : 'none',
    },
    overlay: {
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
    },
  };

  return <ReactModal isOpen={open} onRequestClose={onClose} style={customStyles} {...restProps} />;
};
