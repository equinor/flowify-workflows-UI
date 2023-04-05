import React, { FC } from 'react';
import { StackProps } from '../stack/types';
import { StyledJsonWrapper } from './styles';

interface JsonWrapperProps extends StackProps {}

export const JsonWrapper: FC<JsonWrapperProps> = (props: JsonWrapperProps) => {
  return <StyledJsonWrapper {...props} />;
};
