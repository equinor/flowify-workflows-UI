import React, { FC } from 'react';
import { StyledTable } from './styles';

interface TableProps {}

export const Table: FC<TableProps> = (props: TableProps) => {
  return <StyledTable {...props} />;
};
