import React, { FC, useRef } from 'react';
import { useSelect, useMultipleSelection } from 'downshift';
import { Option, OptionsWrapper, SelectButton, SelectWrapper } from '../select/styles';
import { isNotEmptyArray } from '../../../../common';
import { Stack } from '../../../ui';
import { Icon, Typography } from '@equinor/eds-core-react';
import { MultiSelectProps } from './types';
import { IOption } from '../select/types';

export const MultiSelect: FC<MultiSelectProps> = (props: MultiSelectProps) => {
  const { placeholder, options, value, onChange, label } = props;

  const inputRef = useRef(null);
  const initialSelectedItems: IOption[] = options.filter((option) => value?.includes(option?.value));

  const { getDropdownProps, addSelectedItem, removeSelectedItem } = useMultipleSelection({
    initialSelectedItems,
  });

  const { isOpen, getToggleButtonProps, getLabelProps, getMenuProps, highlightedIndex, getItemProps } = useSelect({
    selectedItem: null,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    items: options,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          };
      }
      return changes;
    },
    onStateChange: (stateChange) => {
      const { type, selectedItem } = stateChange;
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (selectedItem) {
            const { value: selectedValue } = selectedItem;
            if (value?.includes(selectedValue)) {
              removeSelectedItem(selectedItem);
              const index = value.findIndex((item) => item === selectedValue);
              if (typeof props.removeValue === 'function') {
                props.removeValue(index);
                return;
              }
              value.splice(index, 1);
              if (typeof onChange === 'function') {
                onChange(value);
              }
              return value;
            }
            addSelectedItem(selectedItem);
            if (typeof props.addValue === 'function') {
              props.addValue(selectedValue);
              return;
            }
            if (typeof onChange === 'function') {
              onChange([...(value || []), selectedValue]);
            }
          }
          break;
        default:
          break;
      }
    },
  });

  return (
    <SelectWrapper style={props?.style}>
      {label && (
        <Typography {...getLabelProps({ label: label })} variant="body_short_bold">
          {label}
        </Typography>
      )}
      <SelectButton
        {...getToggleButtonProps(
          getDropdownProps({
            preventKeyAction: isOpen,
            'aria-label': props['aria-label'],
            'aria-describedby': props['aria-describedby'],
            'aria-errormessage': props['aria-errormessage'],
            'aria-labelledby': props['aria-labelledby'],
            ref: inputRef,
          }),
        )}
      >
        <Stack spacing={0.5} alignItems="center">
          {isNotEmptyArray(value) || <span className="dmf-custom-select--placeholder">{placeholder} &nbsp;</span>}
          {value?.join(', ')}
        </Stack>
        {/*  {isNotEmptyArray(value) && clearable && (
            <ClearIcon clearValue={clearValue} inputRef={inputRef} />
        )} */}
        <Icon name="chevron_down" />
      </SelectButton>
      <OptionsWrapper {...getMenuProps()} style={{ maxHeight: '180px' }}>
        {isOpen &&
          isNotEmptyArray(options) &&
          options.map((item: IOption, index: number) => (
            <Option highlighted={highlightedIndex === index} key={`${item}${index}`} {...getItemProps({ item, index })}>
              {value?.includes(item?.value) ? <Icon name="checkbox" /> : <Icon name="checkbox_outline" />}
              {item?.label}
            </Option>
          ))}
      </OptionsWrapper>
    </SelectWrapper>
  );
};
