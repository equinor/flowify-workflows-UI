import * as React from 'react';
import { useState } from 'react';
import ReactFlow, {
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
} from 'react-flow-renderer/nocss';
import { StartNode, TaskNode, EndNode, ConditionalNode, MapNode } from '.';
import { Component } from '../../../../models/v2';
import { Button, Snackbar } from '@equinor/eds-core-react';
import {
  removeConnection,
  ICustomConnection,
  removeTaskNode,
  removeStartNode,
  checkValidation,
  addConnection,
  removeEndNode,
  updateTaskNodePostion,
  updateParameterPosition,
} from '../../helpers';
import { ReactFlowWrapper } from './styles';

interface IGraphEditor {
  component: Component | null;
  onChange: (component: Component) => void;
  elements?: any;
  nodes?: any;
  edges?: any;
  setElements?: any;
  subcomponents?: Component[];
  onNodesChange?: any;
  onEdgesChange?: any;
  mapModalOpen?: boolean;
}

export const GraphEditor: React.FC<IGraphEditor> = (props: IGraphEditor) => {
  const { component, onChange, nodes, edges, mapModalOpen } = props;
  const [wrongConnectionAlert, setWrongConnectionAlert] = useState<boolean>(false);

  const nodeTypes = React.useMemo(
    () => ({
      conditionalNode: ConditionalNode,
      taskNode: TaskNode,
      startNode: StartNode,
      endNode: EndNode,
      mapNode: MapNode,
    }),
    [],
  );

  if (!component) {
    return null;
  }

  function onEdgesDelete(elementToRemove: any) {
    if (mapModalOpen) {
      return;
    }
    const removedObject = elementToRemove[0];
    const modifiedComponent = removeConnection(removedObject as ICustomConnection, component!);
    onChange(modifiedComponent);
    return;
  }

  /**
   * Called when elements are deleted in the graph interface.
   * Can be connection (edge), taskNode, startNode (component input) or endNode (component output)
   * @param elementsToRemove
   * @returns
   */
  const onNodesDelete = (elementsToRemove: any) => {
    if (mapModalOpen) {
      return;
    }
    const removedObject = elementsToRemove[0];
    const { type } = removedObject;
    // is startnode
    if (type === 'startNode') {
      const modifiedComponent = removeStartNode(removedObject as Node, component);
      onChange({ ...modifiedComponent });
      return;
    }
    // is taskNode
    if (type === 'taskNode' || type === 'mapNode' || type === 'conditionalNode') {
      const modifiedComponent = removeTaskNode(removedObject as Node, component);
      onChange({ ...modifiedComponent });
      return;
    }
    // is endnode
    if (type === 'endNode') {
      const modifiedComponent = removeEndNode(removedObject as Node, component);
      onChange({ ...modifiedComponent });
      return;
    }
    console.error(`Not supported graph element of type ${type}`);
  };

  async function onConnect(params: Edge<any> | Connection) {
    console.log('onConnect called');
    const [isValidConnection, isBaseInput, isBaseOutput] = await checkValidation(
      params,
      component!,
      props.subcomponents,
    );
    if (isValidConnection) {
      const modifiedComponent = addConnection(params, isBaseInput, isBaseOutput, component!);
      onChange({ ...modifiedComponent });
      return;
    }
    setWrongConnectionAlert(true);
  }

  function onNodeDragStop(node: Node) {
    if (mapModalOpen) {
      return;
    }
    const { type } = node;
    if (type === 'taskNode' || type === 'mapNode' || type === 'conditionalNode') {
      const moved = updateTaskNodePostion(component!, node);
      onChange(moved);
      return;
    }
    if (type === 'startNode' || type === 'endNode') {
      const moved = updateParameterPosition(component!, node, type === 'startNode' ? 'inputs' : 'outputs');
      onChange(moved);
      return;
    }
  }

  return (
    <ReactFlowWrapper>
      <Snackbar placement="top" open={wrongConnectionAlert} onClose={() => setWrongConnectionAlert(false)}>
        Connection refused: Media types do not match.
        <Snackbar.Action>
          <Button onClick={() => setWrongConnectionAlert(false)} variant="ghost">
            Close
          </Button>
        </Snackbar.Action>
      </Snackbar>
      <ReactFlowProvider>
        <ReactFlow
          onNodesDelete={(nodes) => onNodesDelete(nodes)}
          onEdgesDelete={(edges) => onEdgesDelete(edges)}
          nodes={nodes}
          edges={edges}
          onNodesChange={props.onNodesChange}
          onEdgesChange={props.onEdgesChange}
          onNodeDragStop={(event, node) => onNodeDragStop(node)}
          onConnect={onConnect}
          onLoad={(reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)}
          nodeTypes={nodeTypes}
          snapGrid={[20, 20]}
          snapToGrid
          defaultZoom={0.75}
        >
          <Background color="rgba(255, 255, 255, 0.15)" gap={16} variant={BackgroundVariant.Lines} />
          <Controls style={{ right: 10, left: 'auto' }} fitViewOptions={{ duration: 1000 }}>
            {/*<NodesDebugger />*/}
          </Controls>
        </ReactFlow>
      </ReactFlowProvider>
    </ReactFlowWrapper>
  );
};
