import { Connection, Edge } from 'react-flow-renderer/nocss';
import { Component, Data, Graph, Node as INode } from '../../../models/v2';

async function getTargetNodeInput(targetNode: Component | string, targetHandle: string, subcomponents: Component[]) {
  if (typeof targetNode === 'string') {
    const component = subcomponents.find((c) => c.uid === targetNode);
    return component?.inputs?.find((input: Data) => `p-${input.name}` === targetHandle);
  }
  return (targetNode as Component)?.inputs?.find((input: Data) => `p-${input.name}` === targetHandle);
}

async function getSourceOutput(sourceNode: Component | string, sourceHandle: string, subcomponents: Component[]) {
  if (typeof sourceNode === 'string') {
    const component = subcomponents.find((c) => c.uid === sourceNode);
    return component?.outputs?.find((output: Data) => `p-${output.name}` === sourceHandle);
  }
  return (sourceNode as Component)?.outputs?.find((output: Data) => `p-${output.name}` === sourceHandle);
}

async function getSourceInput(sourceNode: Component | string, sourceHandle: string, subcomponents: Component[]) {
  if (typeof sourceNode === 'string') {
    const component = subcomponents.find((c) => c.uid === sourceNode);
    return component?.outputs?.find((output) => `p-${output.name}` === sourceHandle);
  }
  return (sourceNode as Component).outputs?.find((output) => `p-${output.name}` === sourceHandle);
}

export async function checkValidation(
  params: Edge<any> | Connection,
  component: Component,
  subcomponents?: Component[],
): Promise<boolean[]> {
  console.log(params);
  const { source, sourceHandle, target, targetHandle } = params;
  const { inputs, outputs } = component!;
  const isBaseInput = sourceHandle?.slice(0, 1) === 'i';
  const isBaseOutput = targetHandle?.slice(0, 1) === 'o';
  const { nodes } = component?.implementation as Graph;
  if (!nodes) {
    throw new Error(
      'Trying to check validation on connection between nodes, but no nodes exist in the component object',
    );
  }
  /**
   * If connection is to component output we need to locate the output in the component outputs list and the source node in the nodes list in the component implementation object
   */
  if (isBaseOutput) {
    const baseOutput = outputs?.find((output) => output.name === target);
    const sourceNode = nodes.find((node: INode) => node.id === source);
    const sourceInput = await getSourceInput(sourceNode?.node!, sourceHandle!, subcomponents!);
    console.log(sourceInput);
    const sourceType = sourceInput?.type;
    const targetType = baseOutput?.type;
    const mapCheck = targetType === 'parameter_array' || sourceType === 'parameter_array';
    return [sourceType === targetType || mapCheck, false, true];
  }
  /**
   * If it's node to node or component input to node, the target will always be a node so we can extract this regardless if the source is component input or a node.
   */
  const { node: targetNode } = nodes.find((node: INode) => node.id === target)!;
  const targetInput = await getTargetNodeInput(targetNode, targetHandle!, subcomponents!);
  /**
   * If component input, locate the input in the component inputs list
   */
  if (isBaseInput && targetInput) {
    const baseInput = inputs?.find((input) => input.name === source);
    const targetType = targetInput.type;
    const sourceType = baseInput!.type;
    const mapCheck = targetType === 'parameter_array' || sourceType === 'parameter_array';
    return [targetType === sourceType || mapCheck, true, false];
  }
  /**
   * Otherwise find the source node in the nodes list in the component implementation object
   */
  const { node: sourceNode } = nodes.find((node: INode) => node.id === source)!;
  const sourceOutput = await getSourceOutput(sourceNode, sourceHandle!, subcomponents!);
  if (sourceOutput && targetInput) {
    const targetType = targetInput.type;
    const sourceType = sourceOutput.type;
    const mapCheck = targetType === 'parameter_array' || sourceType === 'parameter_array';
    return [targetType === sourceType || mapCheck, false, false];
  }
  return [false, false, false];
}
