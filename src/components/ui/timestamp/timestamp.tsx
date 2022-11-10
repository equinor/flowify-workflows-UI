import React from 'react';
import { ago, Ticker } from '@common';

export interface TimestampProps {
  date: Date | string | number | undefined;
}

export const Timestamp: React.FC<TimestampProps> = ({ date }: TimestampProps): React.ReactElement => {
  return (
    <span>
      {date === null || date === undefined ? (
        '-'
      ) : (
        <span title={date.toString()}>
          <Ticker interval={1000}>{() => ago(new Date(date))}</Ticker>
        </span>
      )}
    </span>
  );
};
