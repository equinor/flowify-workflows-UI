import { Icon } from '@equinor/eds-core-react';
import React, { FC } from 'react';
import { isNotEmptyArray } from '../../../../common';
import { Option, OptionsWrapper } from './styles';
import { IOption } from './types';

interface IOptions {
  options: IOption[];
  isOpen: boolean;
  getMenuProps: any;
  highlightedIndex: number;
  getItemProps: any;
  maxDropdownHeight?: string;
  multiple?: boolean;
  value?: string[] | undefined;
}

const Options: FC<IOptions> = (props: IOptions) => {
  const { getMenuProps, isOpen, options, highlightedIndex, getItemProps, maxDropdownHeight, multiple, value } = props;
  return (
    <OptionsWrapper {...getMenuProps()} style={{ maxHeight: maxDropdownHeight }}>
      {isOpen &&
        isNotEmptyArray(options) &&
        options.map((item: IOption, index: number) => (
          <Option
            highlighted={multiple ? value?.includes(item?.value) : highlightedIndex === index}
            key={`${item}${index}`}
            {...getItemProps({ item, index })}
          >
            {multiple ? (
              value?.includes(item?.value) ? (
                <Icon name="checkbox" />
              ) : (
                <Icon name="checkbox_outline" />
              )
            ) : null}
            {item?.label}
          </Option>
        ))}
    </OptionsWrapper>
  );
};

Options.defaultProps = {
  maxDropdownHeight: '190px',
};

export default Options;
