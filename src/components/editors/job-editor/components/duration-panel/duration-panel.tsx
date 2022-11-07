import React from 'react';
import { WorkflowStatus } from '../../../../../models';
import { formatDuration, wfDuration } from '../../../../../common';
import { Ticker } from '../../../../../common/ticker';

export interface DurationPanelProps {
  status: WorkflowStatus;
}

export const DurationPanel: React.FC<DurationPanelProps> = ({ status }: DurationPanelProps): React.ReactElement => {
  return (
    <span>
      {status === null || status === undefined ? (
        '-'
      ) : (
        <span title={'Estimate duration: ' + formatDuration(status.estimatedDuration!)}>
          <Ticker interval={1000}>{() => formatDuration(wfDuration(status))}</Ticker>
        </span>
      )}
    </span>
  );
};
