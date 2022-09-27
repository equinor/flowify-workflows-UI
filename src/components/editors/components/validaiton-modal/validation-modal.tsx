import { List, Typography } from '@equinor/eds-core-react';
import { Dialog } from '@mui/material';
import React, { FC } from 'react';
import { isNotEmptyArray } from '../../../../common';
import { Stack } from '../../../ui';
import { IValidationError } from './types';

interface ValidationModalProps {
  validationErrors: IValidationError[] | undefined;
  open: boolean;
  onClose: () => void;
  onValidate: () => void;
}

export const ValidationModal: FC<ValidationModalProps> = (props: ValidationModalProps) => {
  const { open, onClose, validationErrors } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Stack padding={2} spacing={1}>
        <Typography variant="h4">Validation</Typography>
        <Stack spacing={0.5}>
          <List>
            {isNotEmptyArray(validationErrors) ? (
              validationErrors?.map((error) => (
                <List.Item style={{ marginBottom: '0.25rem' }}>
                  <Typography variant="body_short_bold">{error?.message}</Typography>
                  <Typography variant="body_short">
                    Current value of {error?.path} is «
                    {error?.params?.parsedValue ? error?.params?.parsedValue : error?.value}»
                  </Typography>
                </List.Item>
              ))
            ) : (
              <Typography variant="body_short">No errors found</Typography>
            )}
          </List>
        </Stack>
      </Stack>
    </Dialog>
  );
};
