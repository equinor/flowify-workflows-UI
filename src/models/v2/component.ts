import { kubernetes } from '..';
import { Time } from '../kubernetes';
import { IPageInfo } from '.';

export interface UserData {
  description?: string;
  graphPosition?: {
    x: number;
    y: number;
  };
  value?: string | string[];
}

export type DataTypes = 'parameter' | 'env_secret' | 'artifact' | 'volume' | 'parameter_array';

export interface Data {
  name: string;
  mediatype: string[];
  type: DataTypes;
  userdata?: UserData;
}

export interface Port {
  port: string;
  // if node is not specified it implicitly refers to the enclosing component
  node?: string;
}

export interface Arg {
  source: string | Port;
  target?: { type: string; name?: string; prefix?: string; suffix?: string };
}

export interface FilePath {
  file: string;
}

export interface Result {
  source: string | FilePath;
  target: Port;
}

export interface ComponentImplementationBase {
  type: string;
}

export interface Brick {
  // override type
  type: BrickType;

  // the executing entity
  container: kubernetes.Container;

  args: Arg[];
  results?: Result[];
}

export interface Map {
  type: 'map';
  inputMappings: Edge[];
  outputMappings: Edge[];
  node: Component | CRef;
}

export interface Conditional {
  type: 'conditional';
  inputMappings: Edge[];
  outputMappings: Edge[];
  nodeTrue: Component | CRef;
  nodeFalse: Component | CRef;
  expression: {
    left?: Data | string;
    operator?: string;
    right?: Data | string;
  };
}

type ComponentType = 'component';
type AnyType = any;
type BrickType = 'brick';

export interface Any extends ComponentImplementationBase {
  type: AnyType;
  // empty implementation with type='any'
  // used for building graphs/workflows to be filled out later with bricks
}

// a reference to a component in the server/database
export type CRef = string;
export interface Node {
  // a locally unique identifier
  id: string;
  // a node is either an 'inline' component or a reference to the server/database
  // inline components make it possible to build components from scratch
  node: Component | CRef;
  userdata?: UserData;
}

export interface Edge {
  source: Port;
  target: Port;
}

export interface Graph extends ComponentImplementationBase {
  nodes: Node[];
  edges: Edge[];
  // the input-mapping contains edges from the enclosing component to a port inside the node list
  inputMappings: Edge[];
  // the output-mapping contains edges from node-list to the enclosing component output interface
  outputMappings: Edge[];
}

export interface Metadata {
  name?: string;
  description?: string;
  modifiedBy?: string;
  uid?: CRef;
  previous?: CRef;
  timestamp?: Time;
}

export interface Component extends Metadata {
  type: ComponentType;
  name?: string;
  description?: string;
  inputs?: Data[];
  outputs?: Data[];

  // the implementation takes the data flowing to inputs and either computes
  // it inside a Brick or passes it on to a Graph. The implementation is also responsible
  // for passing internal results back out to the outputs interface
  implementation: Any | Graph | Brick | Map | Conditional;
}

export interface ComponentList {
  items: Component[] | [];
}

export interface ComponentListRequest {
  items: Component[] | [];
  pageInfo: IPageInfo;
}
