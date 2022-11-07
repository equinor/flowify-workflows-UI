import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import ReactJson from 'react-json-view';
import { getResolvedTemplates } from '@common';
import { Stack, Drawer } from '@ui';
import { services } from '@services';
import { NodeStatus, Workflow } from '../../../../../models';
import { NodeSummary } from './components';
import { InputsOutputsDetail } from './components/inputs-outputs-detail';
import { LogViewer } from '../log-viewer';
import { ensurePodName } from './helpers/node-helpers';

interface NodeDetailsProps {
  workflowName?: string;
  workflow?: Workflow;
  nodeStatus?: NodeStatus;
  open: boolean;
  onClose: (open: boolean) => void;
}

export const NodeDetails: React.FC<NodeDetailsProps> = (props: NodeDetailsProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { workflow, nodeStatus } = props;

  useEffect(() => {
    setLogs([]);
  }, [nodeStatus]);

  if (!workflow || !nodeStatus) {
    return null;
  }

  const template = getResolvedTemplates(workflow, nodeStatus)!;

  const getLogs = () => {
    if (loading) {
      return;
    }
    // Reset log on click
    setLogs([]);
    setLoading(true);
    const nodeId = nodeStatus.id;
    const selectedNode = workflow && workflow.status && workflow.status.nodes && workflow.status.nodes[nodeId];
    const podName = ensurePodName(workflow, selectedNode!, nodeId);

    services.workflows_deprecated.getContainerLogs(workflow, podName, nodeId, 'main', '', false).subscribe({
      next: (next) => {
        setLoading(false);
        if (next) {
          // Append log to current log
          setLogs((log) => {
            return [...log, next.content];
          });
        } else {
        }
      },
      // In case of error handle it by logging
      error: (e) => {
        setLoading(false);
        console.warn('Error when fetching logs - failed with: ' + e);
      },
    });
  };

  return (
    <Drawer open={props.open} onClose={() => props.onClose(false)} maxWidth="sm">
      <Stack spacing={1} padding={2} style={{ maxWidth: '650px', flexWrap: 'wrap', position: 'relative' }}>
        <NodeSummary nodeStatus={nodeStatus} />
        <Typography variant="h4">Containers</Typography>
        <ReactJson src={template?.container || {}} name="container" collapsed displayDataTypes={false} />
        <InputsOutputsDetail
          workflow={workflow}
          node={nodeStatus}
          inputs={nodeStatus.inputs}
          outputs={nodeStatus.outputs}
        />
        <Button color="secondary" onClick={getLogs}>
          Fetch logs
        </Button>
        <LogViewer logs={logs} />
      </Stack>
    </Drawer>
  );
};
