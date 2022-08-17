import React, { FC, useEffect } from 'react';
import ReactFlow, {
  Connection,
  Edge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer/nocss';
import { INode } from '../../../helpers/helpers';
import { Component, Map, Edge as IEdge } from '../../../../../models/v2';
import { StartNode, EndNode, ConditionalNode } from '../../graph';
import { addConnection, checkValidation, createNodes } from './map-helpers';
import { SubNode } from '../../graph/sub-node';

interface MapGraphProps {
  component: Component | undefined;
  subcomponents: Component[] | undefined;
  setComponent: any;
  id: string;
}

const nodeTypes = {
  subNode: SubNode,
  mapInput: StartNode,
  mapOutput: EndNode,
  conditionalNode: ConditionalNode,
};

export const MapGraph: FC<MapGraphProps> = (props: MapGraphProps) => {
  const { id, component, subcomponents, setComponent } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const childRef = (component?.implementation as Map)?.node;
  const childNode = typeof childRef === 'string' ? subcomponents?.find((comp) => comp.uid === childRef) : childRef;

  interface ConnectionData {
    connectionType: string;
    sourcePort: string;
    targetPort: string;
  }

  useEffect(() => {
    if (component) {
      function createEdges() {
        const edges: Edge<ConnectionData>[] = [];
        (component?.implementation as Map)?.inputMappings?.forEach((edge, index) => {
          if (edge.source?.port && edge.target?.port) {
            edges.push({
              id: `map-${edge.source.port}-${edge.target.port}_${index}`,
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
              id: `map-${edge.source.port}-${edge.target.port}_${index}`,
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
      setNodes(createNodes(childNode!, id, component));
    }
  }, [setEdges, setNodes, component, childNode, id]);

  async function onConnect(params: Edge | Connection) {
    const [isValidConnection, isBaseInput, isBaseOutput] = await checkValidation(params, component!, subcomponents);
    if (isValidConnection) {
      const modified = addConnection(params, isBaseInput, isBaseOutput, component!);
      setComponent({ ...modified });
    }
  }

  function deleteEdge(edges: Edge<ConnectionData>[]) {
    const { data } = edges[0];

    function deleteMapping(mappings: IEdge[]) {
      const index = mappings.findIndex(
        (mapping) => mapping?.source?.port === data?.sourcePort && mapping?.target?.port === data?.targetPort,
      );
      mappings.splice(index, 1);
      return mappings;
    }

    if (data?.connectionType === 'input') {
      setComponent((prev: Component) => ({
        ...prev,
        implementation: {
          ...prev.implementation,
          inputMappings: deleteMapping((prev?.implementation as Map)?.inputMappings),
        },
      }));
    }

    if (data?.connectionType === 'output') {
      setComponent((prev: Component) => ({
        ...prev,
        implementation: {
          ...prev.implementation,
          outputMappings: deleteMapping((prev?.implementation as Map)?.outputMappings),
        },
      }));
    }
  }

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
