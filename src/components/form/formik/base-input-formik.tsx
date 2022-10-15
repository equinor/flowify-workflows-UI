import React, { FC } from 'react';
import { useField } from 'formik';
import { BaseInputProps } from '../base/base-input/types';
import { BaseInput } from '..';

export interface BaseInputFormikProps extends BaseInputProps {}

export const BaseInputFormik: FC<BaseInputFormikProps> = (props: BaseInputFormikProps) => {
  const { name, onChange } = props;
  const [field, meta, helpers] = useField({ name });
  return (
    <BaseInput
      {...props}
      value={field.value}
      onChange={(e: any) => {
        helpers.setValue(e.target.value);
        if (typeof onChange === 'function') {
          onChange(e.target.value);
        }
      }}
      errorMessage={meta.touched && meta.error ? meta.error : undefined}
      onBlur={field.onBlur}
    />
  );
};
