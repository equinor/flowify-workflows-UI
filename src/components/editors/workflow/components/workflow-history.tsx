import React, { FC } from 'react';
import { Dialog, DialogTitle, Stack } from '@mui/material';
import { Button, Table } from '@equinor/eds-core-react';

interface IHistory {
  open: boolean;
  onClose: () => void;
  versions: any;
  changeVersion: (index: number) => void;
}

export const WorkflowHistory: FC<IHistory> = (props: IHistory) => {
  const { versions } = props;
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Stack sx={{ width: '40vw', padding: '1rem', maxHeight: '60vh' }}>
        <DialogTitle>Workflow history</DialogTitle>
        <Table style={{ width: '100%', minHeight: '0', overflowY: 'auto' }}>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Version</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Array.isArray(versions) &&
              versions.map((version) => (
                <Table.Row key={version}>
                  <Table.Cell>Version {version}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => props.changeVersion(parseInt(version, 10) + 1)} variant="outlined">
                      Open version
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Stack>
    </Dialog>
  );
};

export default WorkflowHistory;
