import { uuid } from '../../../../../common';
import { Component, Edge, Node } from '../../../../../models/v2';
import { nanoid } from '../../../helpers';

function generateMap(nodes: Node[], nodeId: string, subcomponents: Component[] | undefined, options: any) {
  const index = nodes.findIndex((node) => node.id === nodeId);
  const subnode = nodes[index]?.node;
  const subcomponent = typeof subnode === 'string' ? subcomponents?.find((comp) => comp.uid === subnode) : subnode;

  const inputMappings: Edge[] =
    subcomponent?.inputs?.map((input) => ({
      source: { port: input?.name },
      target: { node: nodeId, port: input?.name },
    })) || [];
  const outputMappings: Edge[] =
    subcomponent?.outputs?.map((output) => ({
      source: { node: nodeId, port: output?.name },
      target: { port: output?.name },
    })) || [];

  nodes[index] = {
    id: nodeId,
    node: {
      uid: uuid(),
      name: `Map(${subcomponent?.name})`,
      type: 'component',
      inputs: options?.inputs ? subcomponent?.inputs : [],
      outputs: options?.outputs ? subcomponent?.outputs : [],
      implementation: {
        type: 'map',
        node: subnode,
        inputMappings: options?.inputs && options?.connections ? inputMappings : [],
        outputMappings: options?.outputs && options?.connections ? outputMappings : [],
      },
    },
  };
  return nodes;
}

function generateIf(nodes: Node[]) {
  nodes.push({
    id: `n-${nanoid(6)}`,
    node: {
      uid: uuid(),
      name: 'If component',
      type: 'component',
      implementation: {
        type: 'conditional',
      },
    },
  });
  return nodes;
}

export { generateMap, generateIf };
