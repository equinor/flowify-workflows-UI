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
import { Button as EDSButton, Snackbar } from '@equinor/eds-core-react';
import { Component, Graph } from '@models/v2';
import { Button } from '@ui';
import { services } from '@services';
import { StartNode, TaskNode, EndNode, ConditionalNode, MapNode } from '.';
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
  nanoid,
} from '../../helpers';
import { ReactFlowWrapper } from './styles';
import { MarketplaceModal } from '../marketplace-modal/marketplace-modal';
import { BUTTON_STATE } from '../../../marketplace/add-button/add-button';
import { GraphEditorProps } from './types';

export const GraphEditor: React.FC<GraphEditorProps> = (props: GraphEditorProps) => {
  const { component, onChange, nodes, edges, mapModalOpen, setSubcomponents, setFeedback, setComponent, type } = props;
  const [wrongConnectionAlert, setWrongConnectionAlert] = useState<boolean>(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState<boolean>(false);

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
    onChange({ ...modifiedComponent });
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
      onChange({ ...moved });
      return;
    }
    if (type === 'startNode' || type === 'endNode') {
      const moved = updateParameterPosition(component!, node, type === 'startNode' ? 'inputs' : 'outputs');
      onChange({ ...moved });
      return;
    }
  }

  async function onAddComponent(
    component: Component,
    setButtonState: React.Dispatch<React.SetStateAction<BUTTON_STATE>>,
  ) {
    const { uid, version } = component;
    if (uid && setSubcomponents && setFeedback && setComponent) {
      services.components
        .get(uid, version?.current)
        .then((res) => setSubcomponents((prev) => [...(prev || []), res]))
        .then(() => {
          setButtonState('success');
          setFeedback({
            message: `Component ${component?.name || ''} was successfully added to ${type} graph`,
            type: 'success',
          });
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        })
        .then(() => {
          setComponent((prev) => ({
            ...prev,
            implementation: {
              ...prev?.implementation,
              nodes: [
                ...((prev?.implementation as Graph)?.nodes || []),
                { id: `n${nanoid(8)}`, node: { uid, version: version?.current } },
              ],
            },
          }));
        })
        .catch((error) => {
          console.error(error);
          setFeedback({ message: `Error: Component could not be added to ${type} graph.`, type: 'error' });
          setButtonState('error');
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        });
    }
  }

  return (
    <ReactFlowWrapper>
      <Snackbar placement="top" open={wrongConnectionAlert} onClose={() => setWrongConnectionAlert(false)}>
        Connection refused: Media types do not match.
        <Snackbar.Action>
          <EDSButton onClick={() => setWrongConnectionAlert(false)} variant="ghost">
            Close
          </EDSButton>
        </Snackbar.Action>
      </Snackbar>
      <MarketplaceModal
        open={marketplaceOpen}
        onClose={() => setMarketplaceOpen(false)}
        onAddComponent={onAddComponent}
        component={component}
        setComponent={setComponent}
        subcomponents={props.subcomponents}
      />
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
          <Controls style={{ right: 10, left: 'auto' }} fitViewOptions={{ duration: 1000 }}></Controls>
          <Button
            onClick={() => setMarketplaceOpen(true)}
            style={{ position: 'absolute', right: 30, top: 30, zIndex: 300 }}
            theme="create"
            leftIcon="add"
          >
            Add to graph
          </Button>
        </ReactFlow>
      </ReactFlowProvider>
    </ReactFlowWrapper>
  );
};
