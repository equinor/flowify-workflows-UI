import React from 'react';
import { Component } from '@models/v2';
import { Feedback } from '../feedbacks/types';

export interface GraphEditorProps {
  component: Component | undefined;
  onChange: (component: Component) => void;
  nodes?: any;
  edges?: any;
  subcomponents?: Component[];
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setSubcomponents?: React.Dispatch<React.SetStateAction<Component[] | undefined>>;
  setFeedback?: (feedback: Feedback) => void;
  onNodesChange?: any;
  onEdgesChange?: any;
  mapModalOpen?: boolean;
  type: 'workflow' | 'component' | 'job' | undefined;
}
