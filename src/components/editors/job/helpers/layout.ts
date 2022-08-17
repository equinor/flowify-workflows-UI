// import { layoutGraphFast } from './layout-graph-fast';
import { layoutGraphPretty } from './layout-graph-pretty';
import {Graph, Node} from './types';

export const layout = (graph: Graph, nodeSize: number, horizontal: boolean, hidden: (id: Node) => boolean, fast: boolean) => {
    (layoutGraphPretty)(graph, nodeSize, horizontal, hidden);
};