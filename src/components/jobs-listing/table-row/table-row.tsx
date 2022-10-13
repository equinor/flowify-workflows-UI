import React, { FC, useState } from 'react';
import { Icon, Button as EDSButton, Typography } from '@equinor/eds-core-react';
import { TableRow as TableRowUI, TableCell, Collapse, Stack } from '@mui/material';
//import { Timestamp } from '../../timestamp';
//import { DurationPanel } from '../../duration-panel';
import { Job } from '../../../models/v2';
import { Timestamp } from '../../timestamp';
import { Button } from '../../ui';
//import { ProgressCircle } from '../../ui';
//import moment from 'moment';

interface ITableRow {
  row: Job;
  workspace: string;
}

const TableRow: FC<ITableRow> = (props: ITableRow) => {
  const { row, workspace } = props;
  const [open, setOpen] = useState(false);

  /*  const progress = (phase: any) => {
    if (phase === 'Running' || phase === 'Pending') {
      return <CircularProgress size={16} />;
    }
    if (phase === 'Error' || phase === 'Failed') {
      return <ProgressCircle error />;
    }
    if (phase === 'Succeeded') {
      return <ProgressCircle />;
    }
    return null;
  }; */

  return (
    <>
      <TableRowUI>
        <TableCell>
          <EDSButton onClick={() => setOpen((prev) => !prev)} variant="ghost_icon">
            {open ? <Icon name="chevron_up" /> : <Icon name="chevron_down" />}
          </EDSButton>
        </TableCell>
        <TableCell style={{ paddingTop: '4px' }}>{/* {progress(row?.status?.phase)} */}</TableCell>
        <TableCell>{row.uid || ''}</TableCell>
        <TableCell>{row.modifiedBy?.email}</TableCell>
        <TableCell>{<Timestamp date={row.timestamp} />}</TableCell>
        <TableCell>{row.name || ''}</TableCell>
        <TableCell>
          {row.description || ''}
          {/* <DurationPanel status={row?.status!} /> */}
        </TableCell>
        <TableCell>
          <Button href={`/workspace/${workspace}/job/${row?.uid}`}>View job</Button>
        </TableCell>
      </TableRowUI>
      <TableRowUI>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack sx={{ padding: '1rem' }} direction="row" spacing={4}>
              <div>
                <Typography variant="h6">Description</Typography>
                <Typography variant="body_short">{row.description || ''}</Typography>
              </div>
              <div>
                <Typography variant="h6">Started at</Typography>
                <Typography variant="body_short">
                  {/*  {row?.status?.startedAt ? (
                    <>
                      {moment(row?.status?.startedAt).format('MMMM Do YYYY')}
                      <br />
                      {moment(row?.status?.startedAt).format('h:mm:ss')}
                    </>
                  ) : (
                    ''
                  )} */}
                </Typography>
              </div>
              <div>
                <Typography variant="h6">Finished at</Typography>
                <Typography variant="body_short">
                  {/*  {row?.status?.finishedAt ? (
                    <>
                      {moment(row?.status?.finishedAt).format('MMMM Do YYYY')}
                      <br />
                      {moment(row?.status?.finishedAt).format('h:mm:ss')}
                    </>
                  ) : (
                    ''
                  )} */}
                </Typography>
              </div>
            </Stack>
          </Collapse>
        </TableCell>
      </TableRowUI>
    </>
  );
};

export default TableRow;
