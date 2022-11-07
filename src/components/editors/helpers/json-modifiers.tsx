import { Node } from 'react-flow-renderer/nocss';
import { isNotEmptyArray } from '@common';
import { Component, Graph } from '@models/v2';

export interface ICustomConnection {
  type: string;
  sourceHandle: string;
  source: string;
  target: string;
  targetHandle: string;
  data: {
    connectionType: 'node' | 'input' | 'output';
  };
}

export function removeConnection(removedObject: ICustomConnection, component: Component): Component {
  const { connectionType } = removedObject.data;
  if (connectionType === 'input') {
    const { inputMappings } = component.implementation as Graph;
    if (inputMappings) {
      const edgeIndex = inputMappings?.findIndex(
        (input) =>
          input.source.port === removedObject.source?.slice(2) &&
          input.target.port === removedObject.targetHandle.slice(2),
      );
      if (edgeIndex === -1) {
        throw new Error('Could not find deleted connection in component object');
      }
      inputMappings?.splice(edgeIndex, 1);
      return component;
    }
  }
  if (connectionType === 'output') {
    const { outputMappings } = component.implementation as Graph;
    if (outputMappings) {
      const edgeIndex = outputMappings?.findIndex(
        (output) =>
          output.target.port === removedObject.target?.slice(2) &&
          output.source.port === removedObject.sourceHandle.slice(2),
      );
      if (edgeIndex === -1) {
        throw new Error('Could not find deleted connection in component object');
      }
      outputMappings?.splice(edgeIndex, 1);
      return component;
    }
  }
  if (connectionType === 'node') {
    const { edges } = component.implementation as Graph;
    if (edges) {
      const edgeIndex = edges.findIndex(
        (edge) =>
          edge.source.port === removedObject.sourceHandle.slice(2) &&
          edge.target.port === removedObject.targetHandle.slice(2),
      );
      if (edgeIndex === -1) {
        throw new Error('Could not find deleted connection in component object');
      }
      edges.splice(edgeIndex, 1);
      return component;
    }
  }
  return component;
}

export function removeTaskNode(removedElement: Node, component: Component): Component {
  const { nodes, edges, inputMappings, outputMappings } = component.implementation as Graph;
  const { inputs } = component;
  if (!nodes) {
    return component;
  }
  const nodeIndex = nodes.findIndex((node) => node.id === removedElement.id);
  if (nodeIndex === -1) {
    throw new Error('Could not find deleted node in component object');
  }
  nodes.splice(nodeIndex, 1);
  // Remove inputMappings that point to node
  if (Array.isArray(inputMappings) && inputMappings.length > 0) {
    (component.implementation as Graph).inputMappings = inputMappings.filter(
      (inputMapping) => inputMapping.target.node !== removedElement.id,
    );
  }
  // Remove outputMappings that point to node
  if (Array.isArray(outputMappings) && outputMappings.length > 0) {
    (component.implementation as Graph).outputMappings = outputMappings.filter(
      (outputMapping) => outputMapping.source.node !== removedElement.id,
    );
  }
  // Remove edges that point to node
  if (Array.isArray(edges) && edges.length > 0) {
    (component.implementation as Graph).edges = edges.filter(
      (edge) => edge.source.node !== removedElement.id && edge.target.node !== removedElement.id,
    );
  }
  // Remove automatically created secret and volume inputs that belong to node
  if (isNotEmptyArray(inputs)) {
    component.inputs = inputs?.filter((input) => !input?.name?.includes(removedElement.id));
  }
  return component;
}

export function removeStartNode(removedElement: Node, component: Component): Component {
  const { inputs } = component;
  const { inputMappings } = component.implementation as Graph;
  if (inputs) {
    const nodeIndex = inputs.findIndex((input) => input.name === removedElement.id?.slice(2));
    if (nodeIndex === -1) {
      throw new Error('Could not find deleted node in component object');
    }
    inputs.splice(nodeIndex, 1);
    // Remove all connections that belongs to the start/input node
    if (Array.isArray(inputMappings) && inputMappings.length > 0) {
      (component.implementation as Graph).inputMappings = inputMappings.filter(
        (inputMapping) => inputMapping.source.port !== removedElement.id?.slice(2),
      );
    }
    return component;
  }
  return component;
}

export function removeEndNode(removedElement: Node, component: Component): Component {
  const { outputs } = component;
  const { outputMappings } = component.implementation as Graph;
  if (outputs) {
    const nodeIndex = outputs.findIndex((output) => output.name === removedElement.id?.slice(2));
    if (nodeIndex === -1) {
      throw new Error('Could not find deleted node in component object');
    }
    outputs.splice(nodeIndex, 1);
    if (Array.isArray(outputMappings) && outputMappings.length > 0) {
      (component.implementation as Graph).outputMappings = outputMappings.filter(
        (outputMapping) => outputMapping.target.port !== removedElement.id?.slice(2),
      );
    }
    return component;
  }
  return component;
}

export function addConnection(
  params: any,
  isBaseInput: boolean,
  isBaseOutput: boolean,
  component: Component,
): Component {
  // If node connected from is component input we use component inputMappings
  if (isBaseInput) {
    if (!(component.implementation as Graph).inputMappings) {
      (component.implementation as Graph).inputMappings = [];
    }
    const { inputMappings } = component.implementation as Graph;
    inputMappings?.push({
      source: { port: params.source.slice(2) },
      target: { node: params.target, port: params.targetHandle.slice(2) },
    });
    return component;
  }
  if (isBaseOutput) {
    if (!(component.implementation as Graph).outputMappings) {
      (component.implementation as Graph).outputMappings = [];
    }
    const { outputMappings } = component.implementation as Graph;
    outputMappings?.push({
      source: { node: params.source, port: params.sourceHandle.slice(2) },
      target: { port: params.target.slice(2) },
    });
    return component;
  }
  // Otherwise we need to update the edges object
  if (!(component.implementation as Graph).edges) {
    (component.implementation as Graph).edges = [];
  }
  const { edges } = component.implementation as Graph;
  edges?.push({
    source: { node: params.source, port: params.sourceHandle.slice(2) },
    target: { node: params.target, port: params.targetHandle.slice(2) },
  });
  return component;
}

export function updateTaskNodePostion(component: Component, node: Node) {
  const nodePlacement = (component?.implementation as Graph).nodes?.findIndex((comp) => comp.id === node.id);
  if (nodePlacement !== -1 && nodePlacement !== undefined) {
    if ((component?.implementation as Graph)?.nodes?.[nodePlacement]) {
      if (!(component.implementation as Graph).nodes?.[nodePlacement].userdata) {
        (component.implementation as Graph).nodes![nodePlacement].userdata = {};
      }
      (component.implementation as Graph).nodes![nodePlacement].userdata!.graphPosition = {
        x: node.position.x,
        y: node.position.y,
      };
      return component;
    }
  }
  return component;
}

export function updateParameterPosition(component: Component, node: Node, type: 'inputs' | 'outputs'): Component {
  const placement = component?.[type]?.findIndex((param) => param.name === node.id?.slice(2));
  if (placement !== -1 && placement !== undefined) {
    if (!component[type]?.[placement].userdata) {
      component[type]![placement].userdata = {};
    }
    component[type]![placement].userdata!.graphPosition = {
      x: node.position.x,
      y: node.position.y,
    };
    return component;
  }
  return component;
}
