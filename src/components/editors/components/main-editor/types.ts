import { Node } from 'react-flow-renderer';
import { Component, Workflow } from '@models/v2';
import { INode } from '../../helpers';
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
  nodes: Node<INode>[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  configComponent?: any;
}
