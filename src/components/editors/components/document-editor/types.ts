import React from 'react';
import { Workflow, Component, WorkflowListRequest, ComponentListRequest } from '../../../../models/v2';
import { IFilter, IPagination } from '../../../../services';

export interface DocumentEditorProps {
  document: Workflow | Component | undefined;
  setInstance:
    | React.Dispatch<React.SetStateAction<Workflow | undefined>>
    | React.Dispatch<React.SetStateAction<Component | undefined>>;
  versionsResponse?: WorkflowListRequest | ComponentListRequest | undefined;
  onPublish: () => void;
  onDelete: () => void;
  fetchVersions: (
    filters: IFilter[] | undefined,
    pagination: IPagination | undefined,
    sorting: string | undefined,
  ) => void;
}
