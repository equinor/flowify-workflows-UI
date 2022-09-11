import React, { FC } from 'react';
import { StackProps } from '../stack/types';
import { PaperTheme, StyledPaper } from './styles';

interface PaperProps extends StackProps {
  theme?: PaperTheme;
  children?: React.ReactNode;
}

export const Paper: FC<PaperProps> = (props: PaperProps) => {
  return <StyledPaper {...props} />;
};

Paper.defaultProps = {
  theme: 'paper',
};
