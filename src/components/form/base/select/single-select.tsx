import React, { FC, useRef } from 'react';
import { useSelect, UseSelectStateChange } from 'downshift';
import { IOption, SelectProps } from './types';
import Options from './options';
import { SelectButton, SelectWrapper } from './styles';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '../../../ui';

export const SingleSelect: FC<SelectProps> = (props: SelectProps) => {
  const { placeholder, options, onChange, value, label, icon } = props;
  const inputRef = useRef(null);

  const onSelectedItemChange = (changes: UseSelectStateChange<IOption>) => {
    const { selectedItem } = changes;
    if (selectedItem && typeof onChange === 'function' && !props.readOnly) {
      onChange(selectedItem?.value);
    }
  };

  const initialSelectedItem = options.find((option: any) => option?.value === value);

  const { isOpen, selectedItem, getToggleButtonProps, getLabelProps, getMenuProps, highlightedIndex, getItemProps } =
    useSelect({
      items: options,
      onSelectedItemChange,
      initialSelectedItem,
    });

  /*   const clearValue = () => {
    reset();
    if (typeof onChange === 'function') {
      onChange('');
    }
  }; */

  return (
    <SelectWrapper style={props?.style}>
      {label && (
        <Typography style={{ paddingBottom: '0.5rem' }} {...getLabelProps({ label: label })} variant="body_short_bold">
          {label}
        </Typography>
      )}
      <SelectButton
        type="button"
        ref={inputRef}
        {...getToggleButtonProps({
          'aria-label': props['aria-label'],
          'aria-describedby': props['aria-describedby'],
          'aria-errormessage': props['aria-errormessage'],
          'aria-labelledby': props['aria-labelledby'],
        })}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && <Icon name={icon} />}
          <span>{(selectedItem && selectedItem?.label) || placeholder}</span>
        </Stack>
        <Icon name="chevron_down" />
        {/* {props.clearable && isNotEmptyArray(value) && (
          <ClearIcon
              clearValue={clearValue}
              inputRef={inputRef}
          />
      )} */}
      </SelectButton>
      <Options
        options={options}
        isOpen={isOpen}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
        maxDropdownHeight={props.maxDropdownHeight}
      />
    </SelectWrapper>
  );
};
