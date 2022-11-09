import { Component, Workflow } from '@models/v2';

export interface SidebarProps {
  component: Component | null | undefined;
  document: Workflow | Component | undefined;
  setComponent: any;
  setDocument: any;
  workspace: string;
  secrets?: string[];
  isLatest?: boolean;
}

export type ImplementationTypes = 'any' | 'brick' | 'graph';
