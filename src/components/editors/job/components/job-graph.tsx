import React, { useEffect } from 'react';
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer/nocss';
import { NodeStatus } from '../../../../models';
import { layout } from '../helpers/layout';
import { ExecNode, HiddenNode } from './node-types';
import { visible, graphToReactflow, prepareGraph } from './helpers/graph-helpers';
import { useEdgesState, useNodesState } from 'react-flow-renderer';

interface JobGraphProps {
  workflowName: string;
  nodes: { [nodeId: string]: NodeStatus };
  setSelectedNodeId?: any;
  nodeClicked?: (nodeId: string) => any;
}

const nodeTypes = {
  execNode: ExecNode,
  hiddenNode: HiddenNode,
};

export const JobGraph: React.FC<JobGraphProps> = (props: JobGraphProps) => {
  const { workflowName, nodes: jobNodes, nodeClicked } = props;
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
    <div style={{ flexGrow: '1', height: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodeClick={(event, node) => (typeof nodeClicked === 'function' ? nodeClicked(node.id) : null)}
        />
      </ReactFlowProvider>
    </div>
  );
};
