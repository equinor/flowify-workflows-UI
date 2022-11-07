import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { useFormikContext } from 'formik';
import { SelectFormik, createOptionsFromSingleValue, TextInputFormik, TextListFormik, MultiSelectFormik } from '@form';
import { Button, Stack, Modal } from '@ui';
import { Data } from '@models/v2';
import { MEDIATYPES, TYPES } from '../types';
import { StyledParameterWrapper } from './styles';

interface ParameterEditorProps {
  open: boolean;
  onClose: () => void;
  onlyEditableValue: boolean | undefined;
  removeInput: () => void;
  editableValue: boolean | undefined;
  secret?: boolean;
  volume?: boolean;
  type?: 'input' | 'output';
}

export const ParameterEditor: FC<ParameterEditorProps> = (props: ParameterEditorProps) => {
  const { open, onlyEditableValue, removeInput, type } = props;
  const { values, setTouched, submitForm, isValid } = useFormikContext();

  function trySubmit() {
    submitForm().then(() => {
      if (isValid) {
        return;
      }
      setTouched({
        name: true,
        value: true,
        description: true,
        type: true,
      });
    });
  }

  return (
    <Modal open={open} onClose={trySubmit} fullWidth maxWidth="sm">
      <StyledParameterWrapper padding={2} spacing={2}>
        <Typography variant="h5">Edit {type}</Typography>
        <TextInputFormik name="name" label="Name" readOnly={onlyEditableValue} />
        {props.editableValue &&
          type === 'input' &&
          ((values as Data)?.type === 'parameter_array' ? (
            <TextListFormik name="value" label="Value" addButtonLabel="Add value" />
          ) : (
            <TextInputFormik name="value" label="Value" />
          ))}
        <TextInputFormik name="description" label="Description" multiline rows={3} readOnly={onlyEditableValue} />
        <SelectFormik
          name="type"
          label="Type"
          placeholder="Select type"
          readOnly={onlyEditableValue}
          options={
            props.secret
              ? [{ label: 'Secret', value: 'env_secret' }]
              : props.volume
              ? [{ label: 'Volume', value: 'volume' }]
              : createOptionsFromSingleValue(TYPES)
          }
        />
        {(values as Data)?.type === 'parameter' || (values as Data)?.type === 'parameter_array' ? (
          <MultiSelectFormik
            name="mediatype"
            label="Mediatype"
            placeholder="Select mediatype"
            disabled={onlyEditableValue}
            options={createOptionsFromSingleValue(MEDIATYPES)}
          />
        ) : null}
        <Stack style={{ paddingTop: '2rem' }} direction="row" spacing={2} justifyContent="space-between">
          {!onlyEditableValue ? (
            <Button theme="danger" onClick={() => removeInput()}>
              <Icon name="delete_forever" /> Delete
            </Button>
          ) : (
            <div />
          )}
          <Button theme="create" onClick={trySubmit}>
            Update
          </Button>
        </Stack>
      </StyledParameterWrapper>
    </Modal>
  );
};
