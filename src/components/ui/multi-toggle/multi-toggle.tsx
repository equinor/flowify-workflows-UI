import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { nanoid } from '@common';
import { MultiToggleProps, ToggleButtonProps } from './types';
import { StyledMultiToggle, StyledToggleButton } from './styles';
import { Stack } from '../stack/stack';

export const ToggleButton: FC<ToggleButtonProps> = (props: ToggleButtonProps) => {
  return <button {...props} />;
};

export const MultiToggle: FC<MultiToggleProps> = (props: MultiToggleProps) => {
  const { label, children, labelVariant } = props;

  const id = props.id || nanoid(6);

  return (
    <Stack id={id} spacing={0.5} style={props.style}>
      {label && (
        <Typography id={`${id}--label`} variant={labelVariant}>
          {label}
        </Typography>
      )}
      <StyledMultiToggle role="radiogroup" aria-label={props['aria-label']}>
        {children &&
          React.Children.map(children, (child: any, index) =>
            child ? <StyledToggleButton {...child?.props} role="radio" aria-labelledby={`${id}--label`} /> : null,
          )}
      </StyledMultiToggle>
    </Stack>
  );
};

MultiToggle.defaultProps = {
  labelVariant: 'body_short_bold',
};
