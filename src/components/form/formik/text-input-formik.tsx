import React, { FC } from 'react';
import { BaseInputFormik, BaseInputFormikProps } from './base-input-formik';

export const TextInputFormik: FC<BaseInputFormikProps> = (props: BaseInputFormikProps) => {
  return <BaseInputFormik {...props} type="text" />;
};
