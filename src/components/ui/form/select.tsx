import React, { FC } from 'react';
import { Checkbox, ListItemText, MenuItem, Select as MUISelect, Stack } from '@mui/material';
import { Icon, Typography } from '@equinor/eds-core-react';

export interface SelectProps {
  id?: string;
  icon?: string;
  options?: { label?: string; value?: string }[] | undefined;
  onChange?: any;
  label?: string;
  value?: string | string[];
  wrapperStyles?: any;
  placeholder?: string;
  [propname: string]: any;
}

export function createOptionsFromSingleValue(list: string[]) {
  const options = list?.map((item) => ({ label: item, value: item }));
  return options || [];
}

export const Select: FC<SelectProps> = (props: SelectProps) => {
  const {
    id,
    value,
    options,
    icon,
    onChange,
    label,
    wrapperStyles,
    placeholder,
    errorMessage,
    children,
    multiple,
    ...selectProps
  } = props;

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
        multiple={multiple}
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
            {multiple && <Checkbox checked={value?.includes(option.value!)} />}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
        {children ? children : null}
      </MUISelect>
    </Stack>
  );
};

Select.defaultProps = {
  wrapperStyles: {},
};
