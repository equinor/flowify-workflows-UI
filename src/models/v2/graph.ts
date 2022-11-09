import { Component, Graph, Brick, Any, Edge } from '.';

export interface IGraphNode {
  label?: string;
  component?: Component;
  mediatype?: string[];
  type?: string;
  implementation?: Graph | Brick | Any;
  setParameterConfig?: any;
  subcomponents?: Component[];
  setConfigComponent?: any;
  inputMappings?: Edge[];
  isInlineComponent?: boolean;
}

export interface IConnectionData {
  connectionType: string;
  sourcePort?: string;
  targetPort?: string;
}
