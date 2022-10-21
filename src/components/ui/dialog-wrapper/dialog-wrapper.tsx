import React, { FC } from 'react';
import { StackProps } from '../stack/types';
import { StyledDialogWrapper } from './styles';

interface DialogWrapperProps extends StackProps {}

export const DialogWrapper: FC<DialogWrapperProps> = (props: DialogWrapperProps) => {
  return <StyledDialogWrapper {...props} />;
};
