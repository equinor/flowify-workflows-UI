import React from 'react';
import { Component, Data, Result, Workflow } from '../../../../../models/v2';
export interface ResultProps {
  result: Result;
  outputs?: Data[];
  index: number;
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
  setWorkflow?: React.Dispatch<React.SetStateAction<Workflow | undefined>>;
}
