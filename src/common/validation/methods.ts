import { getComponentFromRef } from '../../components/editors/helpers';
import { Component, Graph } from '../../models/v2';

export function isOnlyDigits(value: string) {
  return /^\d+$/.test(value);
}

export function startsWithLetter(value: string | undefined) {
  return value ? /[a-z]/i.test(value.charAt(0)) : true;
}

export function noWhitespace(value: string | undefined) {
  return value ? !value.includes(' ') : true;
}

export async function checkConnections(
  component: Component | undefined,
  subcomponents: Component[],
): Promise<string[]> {
  const { implementation } = component || {};
  if (implementation?.type !== 'graph') {
    return [];
  }
  const { inputMappings, edges, nodes } = implementation as Graph;
  const warnings: string[] = [];
  nodes?.forEach((node) => {
    const subcomponent = getComponentFromRef(node?.node, subcomponents);
    subcomponent?.inputs?.forEach((input) => {
      const { name } = input;
      const hasMapping = inputMappings?.some(
        (mapping) => mapping?.target?.node === node?.id && mapping?.target?.port === name,
      );
      const hasEdge = edges?.some((edge) => edge?.target?.node === node?.id && edge?.target?.port === name);
      if (!hasMapping && !hasEdge) {
        console.log(`Input parameter for ${subcomponent?.name} with name ${name} does not have a valid connection`);
        warnings.push(`Graph component with name ${subcomponent?.name} is missing a valid connection to port ${name}`);
      }
    });
  });
  return warnings;
}
