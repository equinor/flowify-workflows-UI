import { isNotEmptyArray } from '../../../common';
import { Component, Graph, Map, Conditional, CRef } from '../../../models/v2';
import { services } from '../../../services/v2';

async function referenceHandler(node: Component | CRef | string) {
  if ((node as Component)?.type === 'component') {
    return false;
  }
  if (typeof node === 'string') {
    const res = await services.components.get(node);
    return res;
  }
  const res = await services.components.get((node as CRef)?.uid!, (node as CRef)?.version);
  return res;
}

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
          const mainComp = await referenceHandler(node?.node);
          // If component was string uid reference or CRef, we push the component to the subcomponents array
          if (mainComp) {
            subs.push(mainComp);
          }
          // If the component is inline component, we check if the component implementation type is map or conditional and check/fetch if the child components are crefs or uid references
          if (!mainComp) {
            // Get child node of map and fetch if component reference
            if ((node?.node as Component)?.implementation?.type === 'map') {
              const mapNode = ((node?.node as Component)?.implementation as Map)?.node;
              const res = await referenceHandler(mapNode);
              if (res) {
                subs.push(res);
              }
            }
            // Get child nodes of conditional and fetch if component references
            if ((node?.node as Component)?.implementation?.type === 'conditional') {
              const { nodeTrue, nodeFalse } = (node?.node as Component)?.implementation as Conditional;
              const trueNodeRes = await referenceHandler(nodeTrue);
              if (trueNodeRes) {
                subs.push(trueNodeRes);
              }
              const falseNodeRes = await referenceHandler(nodeFalse);
              if (falseNodeRes) {
                subs.push(falseNodeRes);
              }
            }
          }
        }),
      );
    }
    return subs;
  }
  return [];
}
