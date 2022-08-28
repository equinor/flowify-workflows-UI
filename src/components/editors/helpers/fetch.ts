import { isNotEmptyArray } from '../../../common';
import { Component, Graph, Map, Conditional } from '../../../models/v2';
import { services } from '../../../services/v2';

/**
 * Fetch initial node sub components that are component references to use in Graph.
 * @param component Component model
 * @returns Promise<Component[]>
 */
export async function fetchInitialSubComponents(component: Component): Promise<Component[]> {
  if (component) {
    const subs: Component[] = [];
    const { nodes } = component.implementation as Graph;
    if (isNotEmptyArray(nodes)) {
      await Promise.all(
        nodes!.map(async (node) => {
          // Component reference
          if (typeof node.node === 'string') {
            const res = await services.components.get(node.node);
            subs.push(res);
          }
          // Get child node of map and fetch if component reference
          if ((node?.node as Component)?.implementation?.type === 'map') {
            const mapNode = ((node?.node as Component)?.implementation as Map)?.node;
            if (typeof mapNode === 'string') {
              const res = await services.components.get(mapNode);
              subs.push(res);
            }
          }
          // Get child nodes of conditional and fetch if component references
          if ((node?.node as Component)?.implementation?.type === 'conditional') {
            const { nodeTrue, nodeFalse } = (node?.node as Component)?.implementation as Conditional;
            if (typeof nodeTrue === 'string') {
              const res = await services.components.get(nodeTrue);
              subs.push(res);
            }
            if (typeof nodeFalse === 'string') {
              const res = await services.components.get(nodeFalse);
              subs.push(res);
            }
          }
        }),
      );
    }
    return subs;
  }
  return [];
}
