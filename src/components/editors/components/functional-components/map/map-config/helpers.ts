import { Connection, Edge, Node } from 'react-flow-renderer';
import { Component, Map } from '@models/v2';
import { INode, nanoid, getComponentFromRef } from '../../../../helpers';
import { ConnectionData } from '../types';

export function checkValidation(params: Edge<any> | Connection, component: Component, subcomponents?: Component[]) {
  const { source, sourceHandle, target, targetHandle } = params;
  const { inputs, outputs } = component!;
  const isBaseInput = sourceHandle?.slice(0, 1) === 'i';
  const isBaseOutput = targetHandle?.slice(0, 1) === 'o';

  const node = (component.implementation as Map).node;

  const childComponent = getComponentFromRef(node, subcomponents || []);

  if (isBaseOutput) {
    const baseOutput = outputs?.find((output) => output.name === target);
    const sourceInput = childComponent?.outputs?.find((output) => `p-${output.name}` === sourceHandle?.slice(2));
    const sourceType = sourceInput?.type;
    const targetType = baseOutput?.type;
    const mapCheck = targetType === 'parameter_array' || sourceType === 'parameter_array';
    return [sourceType === targetType || mapCheck, false, true];
  }

  const targetInput = childComponent?.inputs?.find((input) => `p-${input.name}` === targetHandle);

  if (isBaseInput && targetInput) {
    const baseInput = inputs?.find((input) => input.name === source?.slice(2));
    const targetType = targetInput.type;
    const sourceType = baseInput!.type;
    const mapCheck = targetType === 'parameter_array' || sourceType === 'parameter_array';
    return [targetType === sourceType || mapCheck, true, false];
  }
  return [false, false, false];
}

export function addConnection(params: any, isParentInput: boolean, isParentOutput: boolean, component: Component) {
  if (isParentInput) {
    if (!(component.implementation as Map).inputMappings) {
      (component.implementation as Map).inputMappings = [];
    }
    const { inputMappings } = component.implementation as Map;
    inputMappings.push({
      source: { port: params.source.slice(2) },
      target: { node: params.target, port: params.targetHandle.slice(2) },
    });
    return component;
  }
  if (isParentOutput) {
    if (!(component.implementation as Map).outputMappings) {
      (component.implementation as Map).outputMappings = [];
    }
    const { outputMappings } = component.implementation as Map;
    outputMappings.push({
      source: { node: params.source, port: params.sourceHandle.slice(2) },
      target: { port: params.target.slice(2) },
    });
    return component;
  }
  return component;
}

export function createNodes(childNode: Component, id: string, component: Component) {
  // Add child node (the mapped node)
  const nodes: Node<INode>[] = [
    {
      id: id,
      type: 'subNode',
      selectable: false,
      data: {
        label: childNode?.name || id,
        component: childNode,
        implementation: childNode?.implementation,
      },
      position: {
        x: 450,
        y: 260,
      },
    },
  ];
  // Add Input nodes
  component?.inputs?.forEach((input, index) => {
    nodes.push({
      id: `i-${input.name}` || nanoid(6),
      type: 'mapInput',
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
  // Add output nodes
  component?.outputs?.forEach((output, index) => {
    nodes.push({
      id: `o-${output.name}` || nanoid(6),
      type: 'mapOutput',
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
  return nodes;
}

export function createEdges(component: Component, id: string) {
  const edges: Edge<ConnectionData>[] = [];
  (component?.implementation as Map)?.inputMappings?.forEach((edge, index) => {
    if (edge.source?.port && edge.target?.port) {
      edges.push({
        id: `map-input-${edge.source.port}-${edge.target.port}_${index}`,
        source: `i-${edge.source.port}`,
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
        id: `map-output-${edge.source.port}-${edge.target.port}_${index}`,
        source: id,
        sourceHandle: `p-${edge.source.port}`,
        target: `o-${edge.target.port}`,
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
