import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../../ui';

interface IEditorHeader {
  name?: string | null;
  type: 'Workflow' | 'Component' | 'Job';
  children?: React.ReactNode;
  workspace: string;
  version?: string | number;
  loading?: boolean;
}

const EditorHeader: FC<IEditorHeader> = (props: IEditorHeader) => {
  const { workspace } = props;
  return (
    <Breadcrumbs>
      <Link to="/dashboard">Dashboard</Link>
      {workspace && <Link to={`/workspace/${workspace}`}>{workspace}</Link>}
      <span>
        <b>{props.type} editor</b>
      </span>
    </Breadcrumbs>
  );
};

export default EditorHeader;
