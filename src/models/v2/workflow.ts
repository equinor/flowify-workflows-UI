import { Component, IPageInfo, Metadata } from '.';

export interface Workflow extends Metadata {
  type?: 'workflow';
  component?: Component;

  // A Workflow lives inside a workspace
  workspace?: string;
}

export interface WorkflowList {
  items: Workflow[];
}

export interface WorkflowListRequest {
  items: Workflow[] | [];
  pageInfo: IPageInfo;
}
