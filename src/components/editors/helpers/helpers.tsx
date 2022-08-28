import { Edge, Node } from 'react-flow-renderer/nocss';
import { isNotEmptyArray } from '../../../common';
import { Node as ComponentNode, Data, Graph, Brick, Any, Component, Edge as IEdge } from '../../../models/v2';
import { customAlphabet } from 'nanoid';

// RFC1123 alphanumeric + hyphen, we skip hyphen because cant appear at start or end
export function nanoid(len: number) {
  const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  const numbers: string = '0123456789';
  return customAlphabet(lowercase + numbers /* + '-'  exclude hyphen */, len)();
}

export interface INode {
  label?: string;
  inputs?: Data[];
  outputs?: Data[];
  component?: Component;
  mediatype?: string[];
  type?: string;
  componentId?: string;
  description?: string;
  author?: string;
  published?: string;
  implementation?: Graph | Brick | Any;
  node?: Component;
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
  /**
   * If component is cref
   */
  if (typeof node === 'string') {
    const component = subcomponents.find((c) => c.uid === node);
    const type = component?.implementation?.type;
    if (type === 'map' || type === 'conditional') {
      return {
        id,
        type: type === 'map' ? 'mapNode' : 'conditionalNode',
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
    return {
      id: id,
      type: 'taskNode',
      data: {
        label: component?.name || id,
        inputs: component?.inputs,
        outputs: component?.outputs,
        componentId: component?.uid,
        description: component?.description,
        author: component?.modifiedBy,
        published: component?.timestamp,
        implementation: component?.implementation,
        component,
        inputMappings,
        setParameterConfig,
      },
      position: {
        x: componentNode?.userdata?.graphPosition?.x || 400,
        y: componentNode?.userdata?.graphPosition?.y || 100 + 100 * index,
      },
    };
  }
  const n = node as Component;
  const type = n?.implementation?.type;
  if (type === 'map' || type === 'conditional') {
    return {
      id,
      type: type === 'map' ? 'mapNode' : 'conditionalNode',
      data: {
        component: n,
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
  return {
    id: id,
    type: 'taskNode',
    data: {
      label: n?.name || id,
      inputs: n?.inputs,
      outputs: n?.outputs,
      componentId: n?.uid,
      description: n?.description,
      author: n?.modifiedBy,
      published: n?.timestamp,
      implementation: n?.implementation,
      component: n,
      inputMappings,
      setParameterConfig,
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
