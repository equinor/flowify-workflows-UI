import React, { FC, useEffect, useRef, useState } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { Stack } from '@ui';
import { ClearIcon } from './components/clear-icon';
import { MaskToggleButton } from './components/mask-toggle-button';
import { EnhancerWrapper, StyledInputWrapper } from './styles';
import { BaseInputProps } from './types';
export const BaseInput: FC<BaseInputProps> = (props: BaseInputProps) => {
  const {
    onFocus,
    onBlur,
    clearable,
    label,
    startEnhancer,
    endEnhancer,
    clearOnEscape,
    positive,
    errorMessage,
    autoFocus,
    id,
    type,
    multiline,
    ...inputProps
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<boolean>(props.autoFocus || false);
  const [masked, setMasked] = useState<boolean>(true);

  function clearValue() {
    const fakeEvent = {
      target: {
        value: '',
      },
    };
    if (typeof props.onChange === 'function') {
      // @ts-expect-error
      props.onChange(fakeEvent);
    }
  }

  function onInputFocus(e: any) {
    setFocused(true);
    if (typeof onFocus == 'function') {
      onFocus(e);
    }
  }

  function onInputBlur(e: any) {
    setFocused(false);
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
  }

  function onInputKeyDown(e: KeyboardEvent) {
    if (clearOnEscape && e.key === 'Escape' && inputRef.current) {
      clearValue();
      // prevent event from doing other actions that use escape
      e.stopPropagation();
    }
  }

  function getInputType() {
    if (props.type === 'password') {
      return masked ? 'password' : 'text';
    }
    return props.type;
  }

  useEffect(() => {
    const ref = inputRef.current;
    if (ref) {
      if (autoFocus) {
        ref.focus();
      }
      if (clearable) {
        ref.addEventListener('keydown', onInputKeyDown);
      }
    }
    return () => {
      if (clearable && ref) {
        ref.removeEventListener('keydown', onInputKeyDown);
      }
    };
  });

  const Tag = multiline ? 'textarea' : 'input';

  return (
    <Stack spacing={0.5} grow={1}>
      <label id={id}>
        {label && (
          <Typography variant="body_short_bold" style={{ marginBottom: '0.5rem' }}>
            {label}
          </Typography>
        )}
        <StyledInputWrapper
          error={errorMessage !== undefined}
          positive={positive}
          focused={focused}
          readOnly={props.readOnly}
        >
          {startEnhancer && <EnhancerWrapper type="start">{startEnhancer}</EnhancerWrapper>}
          <Tag onBlur={onInputBlur} onFocus={onInputFocus} value={props.value} type={getInputType()} {...inputProps} />
          {clearable && props.value === '' && <ClearIcon clearValue={clearValue} inputRef={inputRef} />}
          {endEnhancer && <EnhancerWrapper type="end">{endEnhancer}</EnhancerWrapper>}
          {type === 'password' && <MaskToggleButton masked={masked} setMasked={setMasked} />}
        </StyledInputWrapper>
      </label>
      {errorMessage && <Typography>{errorMessage}</Typography>}
    </Stack>
  );
};
