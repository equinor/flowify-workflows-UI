import React, { FC } from 'react';
import { useField } from 'formik';
import { SelectProps } from '../base/select/types';
import { Select } from '../base/select/select';

interface SelectFormikProps extends SelectProps {}

export const SelectFormik: FC<SelectFormikProps> = (props: SelectFormikProps) => {
  const { name, onChange } = props;
  const [field, meta, helpers] = useField({ name });
  console.log(field.value);
  return (
    <Select
      {...props}
      value={field.value}
      onChange={(e: any) => {
        console.log(e);
        helpers.setValue(e);
        if (typeof onChange === 'function') {
          onChange(e);
        }
      }}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      onBlur={field.onBlur}
    />
  );
};
