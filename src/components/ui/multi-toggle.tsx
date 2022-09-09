import { Typography } from '@equinor/eds-core-react';
import { TypographyVariants } from '@equinor/eds-core-react/dist/types/components/Typography/Typography.tokens';
import { Stack } from '@mui/material';
import React, { FC } from 'react';
import styled from 'styled-components';
import { nanoid } from '../editors/helpers';

interface MultiToggleProps {
  children: Array<React.ReactNode>;
  label?: string;
  'aria-label'?: string;
  id?: string;
  labelVariant?: TypographyVariants;
}

interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const StyledWrapper = styled.div`
  background-color: #deedee;
  border-radius: 50px;
  display: flex;
  row-gap: 1rem;
  max-width: max-content;
  padding: 0.25rem;
`;

const StyledButton = styled.button<{ active?: boolean }>`
  background: ${(props) => (props.active ? '#97CACE' : 'none')};
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  &:focus {
    outline: 3px dotted #007079;
    outline-offset: 3px;
  }
`;

export const ToggleButton: FC<ToggleButtonProps> = (props: ToggleButtonProps) => {
  return <button {...props} />;
};

export const MultiToggle: FC<MultiToggleProps> = (props: MultiToggleProps) => {
  const { label, children, labelVariant } = props;

  const id = props.id || nanoid(6);

  return (
    <Stack id={id} spacing={1}>
      {label && (
        <Typography id={`${id}--label`} variant={labelVariant}>
          {label}
        </Typography>
      )}
      <StyledWrapper role="radiogroup" aria-label={props['aria-label']}>
        {children &&
          React.Children.map(children, (child: any, index) =>
            child ? <StyledButton {...child?.props} role="radio" aria-labelledby={`${id}--label`} /> : null,
          )}
      </StyledWrapper>
    </Stack>
  );
};

MultiToggle.defaultProps = {
  labelVariant: 'body_short_bold',
};
