import { uuid, nanoid } from '@common';
import { Node } from '@models/v2';

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

export { generateIf };
