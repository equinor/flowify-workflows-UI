import React, { FC, useEffect, useMemo } from 'react';
import ReactFlow, {
  Edge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Background,
  BackgroundVariant,
} from 'react-flow-renderer/nocss';
import { Component, Conditional, Map, IGraphNode, IConnectionData } from '@models/v2';
import { nanoid, getComponentFromRef } from '@common';
import { EndNode, StartNode, TaskNode } from '../../graph';
import { SubNode } from '../../graph/nodes/sub-node';
import { ReactFlowWrapper } from '../../graph/styles';

interface IfGraphProps {
  component: Component | undefined;
  id: string;
  subcomponents: Component[] | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setOpenMarketplace?: any;
}

export const IfGraph: FC<IfGraphProps> = (props: IfGraphProps) => {
  const { component, subcomponents, id } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState<IGraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { nodeTrue, nodeFalse } = component?.implementation as Conditional;
  const trueNode = getComponentFromRef(nodeTrue, subcomponents || []);
  const falseNode = getComponentFromRef(nodeFalse, subcomponents || []);

  const nodeTypes = useMemo(
    () => ({
      taskNode: TaskNode,
      subNode: SubNode,
      ifInput: StartNode,
      ifOutput: EndNode,
    }),
    [],
  );

  useEffect(() => {
    if (component) {
      const nodes: Node<IGraphNode>[] = [];
      if (trueNode) {
        nodes.push({
          id: 'selectedTrueNode',
          type: 'subNode',
          selectable: false,
          data: {
            label: `True: ${trueNode?.name || ''}`,
            component: trueNode,
            implementation: trueNode?.implementation,
          },
          position: {
            x: 450,
            y: 260,
          },
        });
      }
      if (falseNode) {
        nodes.push({
          id: 'selectedFalseNode',
          type: 'subNode',
          selectable: false,
          data: {
            label: `False: ${falseNode?.name || ''}`,
            component: falseNode,
            implementation: falseNode?.implementation,
          },
          position: {
            x: 450,
            y: 460,
          },
        });
      }
      component?.inputs?.forEach((input, index) => {
        nodes.push({
          id: input.name || nanoid(6),
          type: 'ifInput',
          selectable: false,
          data: {
            label: input.name,
            mediatype: input.mediatype,
            type: input.type,
          },
          position: {
            x: 20,
            y: 200 + 50 * index,
          },
        });
      });
      component?.outputs?.forEach((output, index) => {
        nodes.push({
          id: output.name || nanoid(6),
          type: 'ifOutput',
          selectable: false,
          data: {
            label: output.name,
            mediatype: output.mediatype,
            type: output.type,
          },
          position: {
            x: 920,
            y: 200 + 50 * index,
          },
        });
      });
      function createEdges() {
        const edges: Edge<IConnectionData>[] = [];
        (component?.implementation as Map)?.inputMappings?.forEach((edge, index) => {
          if (edge.source?.port && edge.target?.port) {
            edges.push({
              id: `if-${edge.source.port}-${edge.target.port}_${index}`,
              source: edge.source.port,
              sourceHandle: `i-${edge.source.port}`,
              targetHandle: `p-${edge.target.port}`,
              target: id,
              data: {
                connectionType: 'input',
                sourcePort: edge.source.port,
                targetPort: edge.target.port,
              },
            });
          }
        });

        (component?.implementation as Map)?.outputMappings?.forEach((edge, index) => {
          if (edge.source?.port && edge.target?.port) {
            edges.push({
              id: `if-${edge.source.port}-${edge.target.port}_${index}`,
              source: id,
              sourceHandle: `p-${edge.source.port}`,
              target: edge.target.port,
              targetHandle: `o-${edge.target.port}`,
              data: {
                connectionType: 'output',
                sourcePort: edge.source.port,
                targetPort: edge.target.port,
              },
            });
          }
        });
        return edges;
      }
      setEdges(createEdges());
      setNodes(nodes);
    }
  }, [component, trueNode, falseNode, id, setEdges, setNodes]);

  function onConnect() {}
  function deleteEdge(edges: Edge<IConnectionData>[]) {}

  return (
    <ReactFlowWrapper>
      <ReactFlowProvider>
        <ReactFlow
          onConnect={onConnect}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={(edges) => deleteEdge(edges)}
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
          defaultZoom={0.75}
        >
          <Background color="rgba(255, 255, 255, 0.15)" gap={16} variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </ReactFlowProvider>
    </ReactFlowWrapper>
  );
};
