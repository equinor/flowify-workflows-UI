import { Node, Edge } from 'react-flow-renderer/nocss';
import { Graph, NodeLabel, Node as NodeFromGraphType } from '../../helpers/types';
import { NodeStatus, NodeType, NODE_PHASE } from '../../../../../models';

interface PrepareNode {
  nodeName: string;
  children: string[];
  parent: string;
}

export function prepareGraph(workflowName: string, allNodes: { [nodeId: string]: NodeStatus }): Graph {
  const graph = new Graph();
  const edges = graph.edges;
  const nodes = graph.nodes;

  if (!allNodes) {
    return graph;
  }

  // const allNodes = nodes2;
  const getChildren = (nodeId: string): string[] => {
    if (!allNodes[nodeId] || !allNodes[nodeId].children) {
      return [];
    }
    return allNodes[nodeId].children.filter((child) => allNodes[child]);
  };

  const pushChildren = (nodeId: string, isExpanded: boolean, queue: PrepareNode[]): void => {
    const children: string[] = getChildren(nodeId);
    if (!children) {
      return;
    }

    if (false && children.length > 3 && !isExpanded) {
      // Node will be collapsed
      // queue.push({
      //     nodeName: children[0],
      //     parent: nodeId,
      //     children: getChildren(children[0])
      // });
      // const newChildren: string[] = children
      //     .slice(1, children.length - 1)
      //     .map(v => [v])
      //     .reduce((a, b) => a.concat(b), []);
      // queue.push({
      //     nodeName: getCollapsedNodeName(nodeId, children.length - 2 + ' hidden nodes', allNodes[children[0]].type),
      //     parent: nodeId,
      //     children: newChildren
      // });
      // queue.push({
      //     nodeName: children[children.length - 1],
      //     parent: nodeId,
      //     children: getChildren(children[children.length - 1])
      // });
    } else {
      // Node will not be collapsed
      children.map((child) =>
        queue.push({
          nodeName: child,
          parent: nodeId,
          children: getChildren(child),
        }),
      );
    }
  };

  const traverse = (root: PrepareNode): void => {
    const queue: PrepareNode[] = [root];
    const consideredChildren: Set<string> = new Set<string>();
    // let previousCollapsed: string = '';

    while (queue.length > 0) {
      const item = queue.pop()!;

      // if (isCollapsedNode(item.nodeName)) {
      //     if (item.nodeName !== previousCollapsed) {
      //         nodes.set(item.nodeName, {
      //             label: getMessage(item.nodeName),
      //             genre: 'Collapsed',
      //             icon: icons.Collapsed,
      //             classNames: 'Collapsed'
      //         });
      //         edges.set({v: item.parent, w: item.nodeName}, {});
      //         previousCollapsed = item.nodeName;
      //     }
      //     continue;
      // }
      const child = allNodes[item.nodeName];
      if (!child) {
        continue;
      }
      const isExpanded: boolean = false; // this.state.expandNodes.has('*') || this.state.expandNodes.has(item.nodeName);

      nodes.set(item.nodeName, nodeLabel(child) as NodeLabel);
      edges.set({ v: item.parent, w: item.nodeName }, {});

      // If we have already considered the children of this node, don't consider them again
      if (consideredChildren.has(item.nodeName)) {
        continue;
      }
      consideredChildren.add(item.nodeName);

      const node: NodeStatus = allNodes[item.nodeName];
      if (!node || node.phase === NODE_PHASE.OMITTED) {
        continue;
      }

      pushChildren(node.id, isExpanded, queue);
    }
  };

  const workflowRoot: PrepareNode = {
    nodeName: workflowName,
    parent: '',
    children: getChildren(workflowName),
  };

  // Traverse the workflow from the root node
  traverse(workflowRoot);

  const onExitHandlerNodeId = Object.values(allNodes).find((nodeId) => nodeId.name === `${workflowName}.onExit`);
  if (onExitHandlerNodeId) {
    // TODO
    getOutboundNodes(workflowName, allNodes).forEach((v) => {
      const exitHandler = allNodes[onExitHandlerNodeId.id];
      nodes.set(onExitHandlerNodeId.id, nodeLabel(exitHandler) as NodeLabel);
      if (nodes.has(v)) {
        edges.set({ v, w: onExitHandlerNodeId.id }, {});
      }
    });
    const onExitRoot: PrepareNode = {
      nodeName: onExitHandlerNodeId.id,
      parent: '',
      children: getChildren(onExitHandlerNodeId.id),
    };
    // Traverse the onExit tree starting from the onExit node itself
    traverse(onExitRoot);
  }

  return graph;
}
function progress(n: NodeStatus) {
  if (!n || !n.estimatedDuration) {
    return null;
  }
  return (new Date().getTime() - new Date(n.startedAt).getTime()) / 1000 / n.estimatedDuration;
}

function getNodeLabelTemplateName(n: NodeStatus): string {
  return n.templateName || (n.templateRef && n.templateRef.template + '/' + n.templateRef.name) || 'no template';
}

function shortNodeName(node: { name: string; displayName: string; templateName: string; type: NodeType }): string {
  if (node.type === 'DAG') {
    return 'Start';
  }
  return node.templateName || node.displayName || node.name;
}

function nodeLabel(n: NodeStatus) {
  const phase = n.type === 'Suspend' && n.phase === 'Running' ? 'Suspended' : n.phase;
  return {
    label: shortNodeName(n),
    genre: n.type,
    icon: 'icons[phase] || icons.Pending' + phase,
    phase: n.phase,
    progress: phase === 'Running' && progress(n),
    classNames: phase,
    tags: new Set([getNodeLabelTemplateName(n)]),
  };
}

function getNode(nodeId: string, allNodes: { [nodeId: string]: NodeStatus }): NodeStatus | null {
  const node: NodeStatus = allNodes[nodeId];
  if (!node) {
    return null;
  }
  return node;
}

function getOutboundNodes(nodeID: string, allNodes: { [nodeId: string]: NodeStatus }): string[] {
  const node = getNode(nodeID, allNodes);
  if (node === null) {
    return Array<string>();
  }
  if (node.type === 'Pod' || node.type === 'Skipped') {
    return [node.id];
  }
  let outbound = Array<string>();
  for (const outboundNodeID of node.outboundNodes || []) {
    const outNode = getNode(outboundNodeID, allNodes)!;
    if (outNode.type === 'Pod') {
      outbound.push(outboundNodeID);
    } else {
      outbound = outbound.concat(getOutboundNodes(outboundNodeID, allNodes));
    }
  }
  return outbound;
}

export const visible = (graph: Graph, id: NodeFromGraphType) => {
  const label = graph.nodes.get(id)!;
  if (label.genre === 'StepGroup') {
    return false;
  }

  // // If the node matches the search string, return without considering filters
  // if (nodeSearchKeyword && label.label.includes(nodeSearchKeyword)) {
  //     return true;
  // }
  // // If the node doesn't match enabled genres, don't display
  // if (!nodeGenres[label.genre]) {
  //     return false;
  // }
  // // If the node doesn't match enabled node class names, don't display
  // if (nodeClassNames && !Object.entries(nodeClassNames).find(([className, checked]) => checked && (label.classNames || '').split(' ').includes(className))) {
  //     return false;
  // }
  // // If the node doesn't match enabled node tags, don't display
  // if (nodeTags && !Object.entries(nodeTags).find(([tag, checked]) => !label.tags || (checked && label.tags.has(tag)))) {
  //     return false;
  // }
  return true;
};

export function graphToReactflow(graph: Graph): { nodes: any; edges: any } {
  const edges = Array.from(graph.edges, ([edge, label]) => edge)
    .filter((edge) => edge?.v !== '' && edge?.v !== '')
    .map(
      (edge) =>
        ({
          id: `e-${edge.v + edge.w}`,
          source: edge.v,
          target: edge.w,
          //arrowHeadColor: '#007079',
          type: 'step',
          style: { stroke: '#007079', strokeDasharray: 5 },
        } as Edge<any>),
    );

  console.log(graph.nodes);

  const nodes = Array.from(graph.nodes, ([value, key]) => {
    const isVisibleNode = visible(graph, value);
    const calculatedX = (isVisibleNode ? key.x! * 3 : key.x!) || 0;
    var node = {
      id: value,
      type: isVisibleNode ? 'execNode' : 'hiddenNode',
      draggable: false,
      data: {
        label: `${key.label}`,
        icon: `${key.icon}`,
        phase: `${key.phase}`,
      },
      position: { x: calculatedX + 60, y: key.y ? key.y + 60 : 0 + 60 },
    } as Node<any>;
    return node;
  });

  return { nodes, edges };
}
