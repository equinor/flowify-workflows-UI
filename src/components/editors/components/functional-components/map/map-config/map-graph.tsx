import React, { FC, useEffect } from 'react';
import ReactFlow, {
  Connection,
  Edge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer/nocss';
import { INode } from '../../../../helpers/helpers';
import { Component, Map, Edge as IEdge } from '../../../../../../models/v2';
import { StartNode, EndNode, ConditionalNode, SubNode } from '../../../graph';
import { addConnection, checkValidation, createEdges, createNodes } from './helpers';
import { ConnectionData } from '../types';

interface MapGraphProps {
  component: Component | undefined;
  subcomponents: Component[] | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
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

  useEffect(() => {
    if (component) {
      setEdges(createEdges(component, id));
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
      setComponent((prev) => ({
        ...prev,
        implementation: {
          ...prev?.implementation,
          inputMappings: deleteMapping((prev?.implementation as Map)?.inputMappings),
        },
      }));
    }

    if (data?.connectionType === 'output') {
      setComponent((prev) => ({
        ...prev,
        implementation: {
          ...prev?.implementation,
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
