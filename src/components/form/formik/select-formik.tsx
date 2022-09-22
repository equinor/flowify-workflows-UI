import React, { FC } from 'react';
import { useField } from 'formik';
import { SelectProps, Select } from '../../ui/form/select';

interface SelectFormikProps extends SelectProps {}

export const SelectFormik: FC<SelectFormikProps> = (props: SelectFormikProps) => {
  const { name, onChange } = props;
  const [field, meta] = useField({ name });
  return (
    <Select
      {...props}
      value={field.value}
      onChange={(e: any) => {
        field.onChange(e);
        if (typeof onChange === 'function') {
          onChange(e);
        }
      }}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};
