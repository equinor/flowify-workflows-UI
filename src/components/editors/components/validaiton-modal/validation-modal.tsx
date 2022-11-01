import { Typography } from '@equinor/eds-core-react';
import { Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import React, { FC } from 'react';
import { isNotEmptyArray } from '../../../../common';
import { DialogWrapper, Stack, Modal } from '../../../ui';
import { IParameterConfig } from '../../types';
import { ErrorRow } from './components/error-row';
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
            <TableHead>
              <TableRow>
                <TableCell>Error message</TableCell>
                <TableCell>Current value</TableCell>
                <TableCell>Manifest path</TableCell>
                <TableCell>Quick fix</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isNotEmptyArray(validationErrors) ? (
                validationErrors?.map((error) => (
                  <ErrorRow error={error} setParameterConfig={props.setParameterConfig} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No errors found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Stack>
      </DialogWrapper>
    </Modal>
  );
};

export type { IValidationError };
