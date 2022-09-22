import React, { FC } from 'react';
import { BaseInputFormik, BaseInputFormikProps } from './base-input-formik';

export const NumericInputFormik: FC<BaseInputFormikProps> = (props: BaseInputFormikProps) => {
  return <BaseInputFormik {...props} type="text" pattern="[0-9]*" inputMode="numeric" />;
};
