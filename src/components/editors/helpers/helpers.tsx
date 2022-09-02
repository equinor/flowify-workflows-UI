import { Edge, Node } from 'react-flow-renderer/nocss';
import { isNotEmptyArray } from '../../../common';
import { Node as ComponentNode, Data, Graph, Brick, Any, Component, Edge as IEdge, CRef } from '../../../models/v2';
import { customAlphabet } from 'nanoid';

// RFC1123 alphanumeric + hyphen, we skip hyphen because cant appear at start or end
export function nanoid(len: number) {
  const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  const numbers: string = '0123456789';
  return customAlphabet(lowercase + numbers /* + '-'  exclude hyphen */, len)();
}

export interface INode {
  label?: string;
  component?: Component;
  mediatype?: string[];
  type?: string;
  implementation?: Graph | Brick | Any;
  setParameterConfig?: any;
  subcomponents?: Component[];
  setConfigComponent?: any;
  inputMappings?: IEdge[];
}

/**
 * Create input nodes
 * @param inputs
 * @returns <object>
 */
function newStartNodes(inputs: Data[]): Node<INode>[] {
  const nodes = inputs
    .filter((i) => i.name)
    .filter((i) => i.type !== 'env_secret' && i.type !== 'volume')
    .map((input, index) => ({
      id: input.name || nanoid(6),
      type: 'startNode',
      data: {
        label: input.name,
        mediatype: input.mediatype,
        type: input.type,
        userdata: input.userdata,
      },
      position: {
        x: input?.userdata?.graphPosition?.x || 100,
        y: input?.userdata?.graphPosition?.y || 100 + 50 * index,
      },
    }));
  return nodes;
}

/**
 * Create output nodes
 * @param outputs
 * @returns <object>
 */
function newEndNodes(outputs: Data[]): Node<INode>[] {
  const nodes = outputs.map((output, index) => ({
    id: output.name || nanoid(6),
    type: 'endNode',
    data: {
      label: output.name,
      mediatype: output.mediatype,
      type: output.type,
    },
    position: {
      x: output?.userdata?.graphPosition?.x || 700,
      y: output?.userdata?.graphPosition?.y || 100 + 100 * index,
    },
  }));
  return nodes;
}

export function getComponentFromRef(node: Component | CRef | string, subcomponents: Component[]): Component {
  // If node is inline component
  if ((node as Component)?.type === 'component') {
    return node as Component;
  }
  // If node references uid as string
  if (typeof node === 'string') {
    // Since the uid string references don't contain version we want to return the latest version. We filter 'cause there might be different version of the same component - if there only is one, we know that's the right one. If there are more we fetch the latest by the latest tag. We have to do this 'cause old components start from v0 and don't contain the latest tag, so this workaround helps solve that issue. Probably will be deprecated when all components and workflows in the db use the new versioning.
    const subcomps = subcomponents.filter((component) => component.uid === node);
    if (subcomps?.length === 1) {
      return subcomps[0];
    }
    const latest = subcomps.find((component) => component?.version?.tags?.includes('latest'));
    return latest!;
  }
  // If node references uid and version as Cref
  return subcomponents.find(
    (component) => component.uid === (node as CRef)?.uid && component?.version?.current === (node as CRef)?.version,
  ) as Component;
}

/**
 * Create singular task node
 * @param componentNode
 * @param index
 * @returns object
 */
async function createTaskNode(
  componentNode: ComponentNode,
  index: number,
  subcomponents: Component[],
  setParameterConfig?: any,
  setConfigComponent?: any,
  inputMappings?: IEdge[],
): Promise<Node<INode>> {
  const { id, node } = componentNode;
  const component = getComponentFromRef(node, subcomponents);
  const type = component?.implementation?.type;

  return {
    id,
    type: type === 'map' ? 'mapNode' : type === 'conditional' ? 'conditionalNode' : 'taskNode',
    data: {
      component,
      setParameterConfig,
      subcomponents,
      setConfigComponent,
      inputMappings,
    },
    position: {
      x: componentNode?.userdata?.graphPosition?.x || 400,
      y: componentNode?.userdata?.graphPosition?.y || 100 + 100 * index,
    },
  };
}

/**
 * Create a node for each instance in nodes list (that represents a component) from the component implementation object
 * Each node can have multiple handles (inputs/outputs)
 * @param nodes
 * @returns <object>
 */
async function createTaskNodes(
  nodes: ComponentNode[],
  subcomponents: Component[],
  setParameterConfig: any,
  setConfigComponent: any,
  component: Component,
): Promise<Node<INode>[]> {
  if (nodes !== undefined) {
    const { inputMappings } = component?.implementation as Graph;
    const taskNodes = await Promise.all(
      nodes
        .filter((n) => n.id)
        .map(async (node, i) =>
          createTaskNode(node, i, subcomponents, setParameterConfig, setConfigComponent, inputMappings),
        ),
    );
    return taskNodes;
  }
  return [];
}

/**
 * Create component input nodes for graph. Each input is it's own node and only has one handle for that input value
 * @param inputs
 * @returns <object>
 */
function createStartNodes(inputs: Data[] | undefined): Node<INode>[] {
  if (inputs !== undefined && inputs !== null) {
    return [...newStartNodes(inputs!)];
  }
  return [];
}

/**
 * Create component output nodes for graph. Each output is it's own node and only has one handle for that output value
 * @param outputs
 * @returns
 */
function createEndNodes(outputs: Data[] | undefined): Node<INode>[] {
  if (outputs !== undefined && outputs !== null) {
    return [...newEndNodes(outputs!)];
  }
  return [];
}

interface ConnectionData {
  connectionType: string;
}

/**
 * Build connection edges between node parameters and inputs/outputs
 * @param component
 * @returns <object>
 */
function buildConnections(component: Component) {
  const { implementation } = component;
  if (implementation?.type === 'graph') {
    const { edges, inputMappings, outputMappings } = implementation as Graph;
    const connections: Edge<ConnectionData>[] = [];
    if (isNotEmptyArray(edges)) {
      edges?.forEach((edge, index) => {
        if (edge.source?.node && edge.source?.port && edge.target?.node && edge.target?.port) {
          connections.push({
            id: `${edge.source.port}-${edge.target.port}_${index}`,
            source: edge.source.node!,
            sourceHandle: `p-${edge.source.port}`,
            targetHandle: `p-${edge.target.port}`,
            target: edge.target.node!,
            data: {
              connectionType: 'node',
            },
          });
        }
      });
    }
    if (isNotEmptyArray(inputMappings)) {
      inputMappings?.forEach((edge, index) => {
        if (edge.source?.port && edge.target?.node && edge.target?.port) {
          connections.push({
            id: `${edge.source.port}-${edge.target.port}_${index}`,
            source: edge.source.port,
            sourceHandle: `i-${edge.source.port}`,
            targetHandle: `p-${edge.target.port}`,
            target: edge.target.node!,
            data: {
              connectionType: 'input',
            },
          });
        }
      });
    }
    if (isNotEmptyArray(outputMappings)) {
      outputMappings?.forEach((edge, index) => {
        if (edge.source?.port && edge.source?.node && edge.target?.port) {
          connections.push({
            id: `${edge.source.port}-${edge.target.port}_${index}`,
            source: edge.source.node!,
            sourceHandle: `p-${edge.source.port}`,
            target: edge.target.port,
            targetHandle: `o-${edge.target.port}`,
            data: {
              connectionType: 'output',
            },
          });
        }
      });
    }
    return connections;
  }
  return [];
}

/**
 * Call function to create all graph-elements.
 * Creates nodes and connection between handles. Handles are mapped and created inside the custom taskNode, startNode and endNode components.
 * @param component
 * @returns
 */
export async function createGraphElements(
  component: Component | undefined,
  subcomponents?: Component[],
  setParameterConfig?: any,
  setConfigComponent?: any,
): Promise<{ nodes: Node<INode>[]; edges: Edge[] }> {
  if (!component) {
    return { nodes: [], edges: [] };
  }
  const nodes: Node<INode>[] = [...createStartNodes(component.inputs), ...createEndNodes(component.outputs)];
  /**
   * Create task-nodes if implementation is Graph and has nodes
   */
  if ((component.implementation as Graph)?.nodes !== undefined) {
    const { nodes: componentNodes } = component.implementation as Graph;
    if (isNotEmptyArray(componentNodes)) {
      const taskNodes = await createTaskNodes(
        componentNodes!,
        subcomponents || [],
        setParameterConfig,
        setConfigComponent,
        component,
      );
      taskNodes.forEach((node) => nodes.push(node));
    }
  }
  /**
   * Build connection edges between node parameters and inputs/outputs if these exist in the component object
   */
  const connections = buildConnections(component);

  return { nodes, edges: connections };
}
