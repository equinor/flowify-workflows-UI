import React, { FC } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { isNotEmptyArray } from '@common';
import { DialogWrapper, Stack, Modal, Table } from '@ui';
import { IParameterConfig } from '../../types';
import { ErrorRow } from './error-row/error-row';
import { IValidationError } from './types';

interface ValidationModalProps {
  validationErrors: IValidationError[] | undefined;
  open: boolean;
  onClose: () => void;
  onValidate: () => void;
  setParameterConfig: (config: IParameterConfig) => void;
}

export const ValidationModal: FC<ValidationModalProps> = (props: ValidationModalProps) => {
  const { open, onClose, validationErrors } = props;

  return (
    <Modal open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogWrapper padding={2} spacing={1}>
        <Typography variant="h4">Validation</Typography>
        <Stack spacing={0.5}>
          <Table>
            <thead>
              <tr>
                <th>Error message</th>
                <th>Current value</th>
                <th>Manifest path</th>
                <th>Quick fix</th>
              </tr>
            </thead>
            <tbody>
              {isNotEmptyArray(validationErrors) ? (
                validationErrors?.map((error) => (
                  <ErrorRow key={error?.path} error={error} setParameterConfig={props.setParameterConfig} />
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No errors found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Stack>
      </DialogWrapper>
    </Modal>
  );
};

export type { IValidationError };
