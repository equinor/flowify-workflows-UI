import React, { FC, useEffect, useMemo } from 'react';
import ReactFlow, { Edge, ReactFlowProvider, useNodesState, useEdgesState, Node } from 'react-flow-renderer/nocss';
import { Component, Conditional, Map } from '../../../../../models/v2';
import { INode } from '../../../helpers';
import { AddNode, EndNode, StartNode, TaskNode } from '../../graph';
import { SubNode } from '../../graph/sub-node';

interface IfGraphProps {
  component: Component | undefined;
  id: string;
  subcomponents: Component[] | undefined;
  setComponent: any;
  setOpenMarketplace: any;
}

export const IfGraph: FC<IfGraphProps> = (props: IfGraphProps) => {
  const { component, subcomponents, id, setOpenMarketplace } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { nodeTrue, nodeFalse } = component?.implementation as Conditional;
  const trueNode = typeof nodeTrue === 'string' ? subcomponents?.find((comp) => comp.uid === nodeTrue) : nodeTrue;
  const falseNode = typeof nodeFalse === 'string' ? subcomponents?.find((comp) => comp.uid === nodeFalse) : nodeFalse;

  interface ConnectionData {
    connectionType: string;
    sourcePort: string;
    targetPort: string;
  }

  const nodeTypes = useMemo(
    () => ({
      taskNode: TaskNode,
      subNode: SubNode,
      ifInput: StartNode,
      ifOutput: EndNode,
      addNode: AddNode,
    }),
    [],
  );

  useEffect(() => {
    if (component) {
      const nodes: Node<INode>[] = [];
      if (trueNode) {
        nodes.push({
          id: 'selectedTrueNode',
          type: 'subNode',
          selectable: false,
          data: {
            label: `True: ${trueNode?.name || ''}`,
            inputs: trueNode?.inputs,
            outputs: trueNode?.outputs,
            componentId: trueNode?.uid,
            description: trueNode?.description,
            author: trueNode?.modifiedBy,
            published: trueNode?.timestamp,
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
            inputs: falseNode?.inputs,
            outputs: falseNode?.outputs,
            componentId: falseNode?.uid,
            description: falseNode?.description,
            author: falseNode?.modifiedBy,
            published: falseNode?.timestamp,
            implementation: falseNode?.implementation,
          },
          position: {
            x: 450,
            y: 460,
          },
        });
      }
      if (!falseNode) {
        nodes.push({
          id: 'falseNode',
          type: 'addNode',
          selectable: false,
          data: {
            label: 'Add false node',
            setConfigComponent: setOpenMarketplace,
          },
          position: {
            x: 450,
            y: 460,
          },
        });
      }
      component?.inputs?.forEach((input, index) => {
        nodes.push({
          id: input.name,
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
          id: output.name,
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
        const edges: Edge<ConnectionData>[] = [];
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
  }, [component, trueNode, falseNode, id, setEdges, setNodes, setOpenMarketplace]);

  function onConnect() {}
  function deleteEdge(edges: Edge<ConnectionData>[]) {}

  return (
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
      ></ReactFlow>
    </ReactFlowProvider>
  );
};
