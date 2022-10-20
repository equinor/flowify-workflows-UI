import React, { FC } from 'react';
import { Stack, TableRow as TableRowUI, TableCell } from '@mui/material';
import { Workflow } from '../../../models/v2/workflow';
import { Timestamp } from '../../timestamp';
import { RunWorkflow } from '../../creators';
import { Button, Chip } from '../../ui';

interface ITableRow {
  row: Workflow;
  workspace: string;
}

const TableRow: FC<ITableRow> = (props: ITableRow) => {
  const { row, workspace } = props;
  return (
    <TableRowUI>
      <TableCell>{row?.name}</TableCell>
      <TableCell>{row?.description}</TableCell>
      <TableCell>
        <Chip>v{row?.version?.current}</Chip>
      </TableCell>
      <TableCell>{row?.modifiedBy?.email}</TableCell>
      <TableCell>
        <Timestamp date={row?.timestamp!} />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Button href={`/workspace/${workspace}/workflow/${row.uid}/${row?.version?.current}`} color="secondary">
            Edit
          </Button>
          {row?.uid && <RunWorkflow workflow={row.uid} />}
        </Stack>
      </TableCell>
    </TableRowUI>
  );
};

export default TableRow;
