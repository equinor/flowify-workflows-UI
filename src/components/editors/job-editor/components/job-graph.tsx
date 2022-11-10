import React, { useEffect } from 'react';
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer/nocss';
import { useEdgesState, useNodesState } from 'react-flow-renderer';
import { Icon } from '@equinor/eds-core-react';
import { Message } from '@ui';
import { NodeStatus } from '../../../../models';
import { layout } from '../helpers/layout';
import { ExecNode, HiddenNode } from './node-types';
import { visible, graphToReactflow, prepareGraph } from './helpers/graph-helpers';
import { ReactFlowWrapper } from '../../components/graph/styles';
import { LoadingEventsTypes } from '../../../../pages/job/job-page';

interface JobGraphProps {
  workflowName: string;
  nodes: { [nodeId: string]: NodeStatus };
  setSelectedNodeId?: any;
  nodeClicked?: (nodeId: string) => any;
  loadingEvents: LoadingEventsTypes;
}

const nodeTypes = {
  execNode: ExecNode,
  hiddenNode: HiddenNode,
};

export const JobGraph: React.FC<JobGraphProps> = (props: JobGraphProps) => {
  const { workflowName, nodes: jobNodes, nodeClicked, loadingEvents } = props;
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    const graph = prepareGraph(workflowName, jobNodes);
    layout(graph, 84, false, (id) => visible(graph, id), false);
    const graphElements = graphToReactflow(graph);
    setNodes(graphElements.nodes);
    setEdges(graphElements.edges);
  }, [workflowName, jobNodes, setEdges, setNodes]);

  return (
    <ReactFlowWrapper>
      <ReactFlowProvider>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodeClick={(event, node) => (typeof nodeClicked === 'function' ? nodeClicked(node.id) : null)}
        >
          {loadingEvents === 'loading' ? (
            <Message style={{ position: 'absolute', left: '50%', top: '50%' }}>
              <Icon name="loop" /> Loading event stream…{' '}
            </Message>
          ) : loadingEvents === 'failed' ? (
            <Message theme="warning" style={{ position: 'absolute', left: '43%', top: '10%' }}>
              Error loading event stream…
            </Message>
          ) : null}
        </ReactFlow>
      </ReactFlowProvider>
    </ReactFlowWrapper>
  );
};
