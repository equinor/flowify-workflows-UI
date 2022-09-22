import React, { FC } from 'react';
import { MenuItem, Select as MUISelect, Stack } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';

export interface SelectProps {
  id: string;
  icon?: string;
  options: { label?: string; value?: string }[] | undefined;
  onChange: any;
  label?: string;
  value: string | string[];
  wrapperStyles?: any;
  placeholder?: string;
  [propname: string]: any;
}

export const Select: FC<SelectProps> = (props: SelectProps) => {
  const { id, value, options, icon, onChange, label, wrapperStyles, placeholder, errorMessage, ...selectProps } = props;
  return (
    <Stack spacing={1} sx={wrapperStyles}>
      <Typography id={`${id}--label`} variant="body_short_bold">
        {label}
      </Typography>
      <MUISelect
        error={errorMessage !== undefined}
        aria-labelledby={`${id}--label`}
        displayEmpty
        id={id}
        value={value}
        onChange={onChange}
        renderValue={(value) => {
          if (value.length === 0) {
            return <em style={{ color: '#999' }}>{placeholder}</em>;
          }
          return (
            <Stack direction="row" spacing={1}>
              {icon && <Icon name={icon} color="#709DA0" />}{' '}
              <span>{options?.find((option) => option.value === value)?.label}</span>
            </Stack>
          );
        }}
        {...selectProps}
      >
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MUISelect>
    </Stack>
  );
};

Select.defaultProps = {
  wrapperStyles: {},
};
