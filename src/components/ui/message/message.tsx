import React, { FC } from 'react';
import { Icon } from '@equinor/eds-core-react';
import { MessageProps } from './types';
import { StyledMessage } from './styles';

export const Message: FC<MessageProps> = (props: MessageProps) => {
  const { icon, children } = props;
  return (
    <StyledMessage messageTheme={props.theme!} direction="row" padding={1} spacing={1} alignItems="center">
      {icon && <Icon style={{ flexShrink: 0 }} name={icon} />}
      {children}
    </StyledMessage>
  );
};

Message.defaultProps = {
  theme: 'default',
};
