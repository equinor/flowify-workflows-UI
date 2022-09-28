import { IPageInfo, Workflow } from '.';

export interface InputValue {
  value?: string | string[];
  target?: string;
}

export interface Job {
  type: 'job';
  inputValues?: InputValue[];
  workflow: Workflow;
  name?: string;
  description?: string;
  modifiedBy?: {
    email?: string;
    oid?: string;
  };
  uid?: string;
  previous?: string;
  timestamp?: string;
}

export interface JobList {
  items: Job[];
}

export interface JobSubmit extends Job {
  options?: object;
}

export interface IJobsListRequest {
  items: Job[] | [];
  pageInfo: IPageInfo;
}
