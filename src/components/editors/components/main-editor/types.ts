import { Node } from 'react-flow-renderer';
import { Component, Workflow, IGraphNode } from '@models/v2';
import { Feedback } from '../feedbacks/types';

export interface MainEditorProps {
  component: Component | undefined;
  document: Workflow | Component | undefined;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setDocument: React.Dispatch<React.SetStateAction<any | undefined>>;
  workspace: string;
  secrets?: string[];
  setFeedback: (feedback: Feedback) => void;
  subcomponents: Component[] | undefined;
  setSubcomponents: React.Dispatch<React.SetStateAction<Component[] | undefined>>;
  setDirty: (dirty: boolean) => void;
  nodes: Node<IGraphNode>[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  configComponent?: any;
}
