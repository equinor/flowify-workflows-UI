import React, { FC } from 'react';
import { SingleSelect } from './single-select';
import { SelectProps } from './types';

export const Select: FC<SelectProps> = (props: SelectProps) => {
  return <SingleSelect {...props} />;
};

Select.defaultProps = {};
