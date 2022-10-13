import React, { FC } from 'react';
import { FieldArray, useField, useFormikContext } from 'formik';
import { createOptionsFromSingleValue } from '../../ui/form/select';
import { MultiSelectProps } from '../base/multi-select/types';
import { MultiSelect } from '../base/multi-select/multi-select';

interface SelectFormikProps extends MultiSelectProps {}

export const MultiSelectFormik: FC<SelectFormikProps> = (props: SelectFormikProps) => {
  const { name, onChange } = props;
  const { values } = useFormikContext();
  const [, meta] = useField({ name });
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <MultiSelect
          {...props}
          //@ts-ignore
          value={values?.[name]}
          onChange={(e) => {
            if (typeof onChange === 'function') {
              onChange(e);
            }
          }}
          addValue={(item: string) => arrayHelpers.push(item)}
          removeValue={(item: number) => arrayHelpers.remove(item)}
          errorMessage={meta.touched && meta.error ? meta.error : undefined}
        />
      )}
    />
  );
};

export { createOptionsFromSingleValue };
