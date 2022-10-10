import React, { HTMLAttributes } from 'react';

export interface BaseInputProps extends HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  inputRef?: any;
  autoFocus?: boolean;
  clearOnEscape?: boolean;
  type?: string;
  clearable?: boolean;
  label?: string;
  startEnhancer?: string | React.ReactNode;
  endEnhancer?: string | React.ReactNode;
  value?: string | number;
  errorMessage?: string;
  positive?: boolean;
  name: string;
  pattern?: string;
  readOnly?: boolean;
  multiline?: boolean;
  rows?: number;
}
