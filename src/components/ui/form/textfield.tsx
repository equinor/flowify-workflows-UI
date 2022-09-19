import React, { FC } from 'react';
import { TextField as MUITextField, Stack, InputAdornment, StandardTextFieldProps } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';

interface TextFieldProps extends StandardTextFieldProps {
  id: string;
  value?: string;
  icon?: string;
  onChange?: any;
  label?: string;
  wrapperStyles?: any;
  [propname: string]: any;
}

export const TextField: FC<TextFieldProps> = (props: TextFieldProps) => {
  const { id, label, wrapperStyles, icon, ...textfieldProps } = props;
  return (
    <Stack spacing={1} sx={wrapperStyles}>
      <Typography id={`${id}--label`} variant="body_short_bold">
        {label}
      </Typography>
      <MUITextField
        aria-labelledby={`${id}--label`}
        id={id}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              <Icon name={icon} />
            </InputAdornment>
          ) : null,
        }}
        fullWidth
        {...textfieldProps}
      />
    </Stack>
  );
};

TextField.defaultProps = {
  wrapperStyles: {},
};
