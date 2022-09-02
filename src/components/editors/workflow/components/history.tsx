import React, { FC } from 'react';
import { Dialog, DialogTitle, Stack } from '@mui/material';
import { Button, Chip, Table } from '@equinor/eds-core-react';
import { useParams } from 'react-router';

interface IHistory {
  open: boolean;
  onClose: () => void;
  versions: any;
  changeVersion: (index: number) => void;
  currentVersion: number | undefined;
  type: 'component' | 'workflow';
}

export const History: FC<IHistory> = (props: IHistory) => {
  const { versions, currentVersion, type } = props;
  const { component, workflow, workspace } = useParams();

  function getHref(version: number) {
    return type === 'component'
      ? `/component/${component}/${version}`
      : `/workspace/${workspace}/workflow/${workflow}/${version}`;
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <Stack sx={{ padding: '1rem', maxHeight: '60vh' }}>
        <DialogTitle>Version history</DialogTitle>
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
                    {version !== currentVersion ? (
                      <Button href={getHref(version)} variant="outlined">
                        Open version
                      </Button>
                    ) : (
                      <Chip>Current</Chip>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Stack>
    </Dialog>
  );
};

export default History;
