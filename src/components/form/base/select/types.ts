import React from 'react';
import { ICONS } from '../../../../common/icons';

export interface IOption {
  label: string;
  value: string;
}

export interface IChange {
  selectedItem?: IOption;
}

export interface BaseSelectProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-errormessage'?: string;
  'aria-labelledby'?: string;
  className?: string;
  /** Defines if the select value can be cleared. If true a clear icon is rendered when a value is set. */
  clearable?: boolean;
  /** Defines if new options can be created along with choosing existing options. */
  creatable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  positive?: boolean;
  icon?: keyof typeof ICONS;
  /** Sets the id attribute of the internal input element. Allows for usage with labels. */
  id?: string;
  inputInfo?: string;
  label?: string;
  /** Sets max height of the dropdown list. */
  maxDropdownHeight?: string;
  name: string;
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  onInputChange?: React.ChangeEventHandler;
  /** Options to be displayed in the dropdown. If an option has a
   * disabled prop value set to true it will be rendered as a disabled option in the dropdown. */
  options: IOption[];
  /** Sets the placeholder. */
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  /** Defines if the select field is required to have a selection. */
  required?: boolean;
  style?: any;
}

export interface SelectProps extends BaseSelectProps {
  initialSelectedItems?: IOption[];

  onChange?: (item: string) => void;

  /** A current selected value(s). If a selected value has a clearableValue
   * prop set to true it will be rendered as a disabled selected option that can't be cleared. */
  value?: string;
}
