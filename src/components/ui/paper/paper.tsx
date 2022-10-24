import React, { FC } from 'react';
import { StackProps } from '../stack/types';
import { PaperTheme, StyledPaper } from './styles';

interface PaperProps extends StackProps {
  theme?: PaperTheme;
  children?: React.ReactNode;
  hoverable?: boolean;
}

export const Paper: FC<PaperProps> = (props: PaperProps) => {
  const { theme, ...restProps } = props;
  return <StyledPaper {...restProps} paperTheme={theme} />;
};

Paper.defaultProps = {
  theme: 'paper',
  hoverable: false,
};
