import { Component, CRef } from '@models/v2';
import { customAlphabet } from 'nanoid';

// RFC1123 alphanumeric + hyphen, we skip hyphen because cant appear at start or end
export function nanoid(len: number) {
  const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  const numbers: string = '0123456789';
  return customAlphabet(lowercase + numbers /* + '-'  exclude hyphen */, len)();
}

export function isNotEmptyArray(array: any[] | undefined): boolean {
  return Array.isArray(array) && array.length > 0;
}

export function uuid(): string {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * getComponentFromRef
 * Nodes in nodes list for graph implementations references components as either a inline-component (Component), reference object (CRef) or old implementation which is just the uid string.
 * By passing the node and the subcomponents fetched for main workflow/component this function will return the full component that is referenced.
 */
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
