import { Table, Typography } from '@equinor/eds-core-react';
import { Dialog } from '@mui/material';
import React, { FC } from 'react';
import { isNotEmptyArray } from '../../../../common';
import { Stack } from '../../../ui';
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Stack padding={2} spacing={1}>
        <Typography variant="h4">Validation</Typography>
        <Stack spacing={0.5}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Error message</Table.Cell>
                <Table.Cell>Current value</Table.Cell>
                <Table.Cell>Manifest path</Table.Cell>
                <Table.Cell>Quick fix</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {isNotEmptyArray(validationErrors) ? (
                validationErrors?.map((error) => (
                  <ErrorRow error={error} setParameterConfig={props.setParameterConfig} />
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={4}>No errors found</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export type { IValidationError };
