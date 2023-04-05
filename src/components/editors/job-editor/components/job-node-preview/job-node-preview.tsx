import React, { useState, useEffect } from 'react';
import { Typography } from '@equinor/eds-core-react';
import ReactJson from 'react-json-view';
import { DialogWrapper, JsonWrapper, Stack, Drawer, Button } from '@ui';
import { services } from '@services';
import { getResolvedTemplates } from '../../helpers';
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
    <Drawer open={props.open} onClose={() => props.onClose(false)} width={650}>
      <DialogWrapper padding={2} spacing={2} style={{ width: '650px', height: '100%' }}>
        <NodeSummary nodeStatus={nodeStatus} />
        <JsonWrapper>
          <Typography variant="h4">Containers</Typography>
          <ReactJson src={template?.container || {}} name="container" collapsed displayDataTypes={false}/>
        </JsonWrapper>
        <InputsOutputsDetail
          workflow={workflow}
          node={nodeStatus}
          inputs={nodeStatus.inputs}
          outputs={nodeStatus.outputs}
        />
        <Stack alignItems="center">
          <Button leftIcon="loop" theme="create" onClick={getLogs} style={{ minWidth: '325px', height: '1rem', justifyContent: 'center' }}>
            Fetch logs
          </Button>
          <LogViewer logs={logs} />
        </Stack>
      </DialogWrapper>
    </Drawer>
  );
};
