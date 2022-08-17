import { kubernetes, WorkflowSpec } from '../models';

export interface WorkflowJob {
  apiVersion?: string;
  kind?: string;
  metadata: kubernetes.ObjectMeta;
  spec: WorkflowJobSpec;
}

export interface WorkflowJobSpec extends WorkflowSpec {}
