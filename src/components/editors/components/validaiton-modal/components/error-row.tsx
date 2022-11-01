import React, { FC } from 'react';
import { IValidationError } from '../types';
import { Button } from '../../../../ui';
import { IParameterConfig } from '../../../types';

interface ErrorRowProps {
  error: IValidationError;
  setParameterConfig: (config: IParameterConfig) => void;
}

export const ErrorRow: FC<ErrorRowProps> = (props: ErrorRowProps) => {
  const { error, setParameterConfig } = props;

  const quickFixes: { [propname: string]: boolean } = {
    validSecret: true,
    validVolume: true,
  };

  const fixLabels: { [propname: string]: string } = {
    validSecret: 'Update secret',
    validVolume: 'Update volume',
  };

  function handleQuickFix() {
    if (error?.type === 'validSecret' || error?.type === 'validVolume') {
      if (typeof setParameterConfig === 'function') {
        const { nodeid } = error?.params;
        if (nodeid) {
          setParameterConfig({ type: error?.type === 'validSecret' ? 'secret' : 'volume', id: nodeid });
        }
      }
    }
  }

  return (
    <tr style={{ marginBottom: '0.25rem' }}>
      <td>{error?.message}</td>
      <td>
        {error?.params?.parsedValue
          ? error?.params?.parsedValue
          : typeof error?.value === 'string'
          ? error?.value
          : JSON.stringify(error?.value)}
      </td>
      <td>{error?.path}</td>
      <td>
        {quickFixes[error?.type] ? (
          <Button theme="simple" onClick={handleQuickFix}>
            {fixLabels[error?.type] || 'Quick fix'}
          </Button>
        ) : null}
      </td>
    </tr>
  );
};
