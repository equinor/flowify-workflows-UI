import React, { FC } from 'react';
import { Breadcrumbs } from '@ui';

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
    <Breadcrumbs
      links={[
        { title: 'dashboard', href: '/dashboard' },
        { title: workspace, href: `/workspace/${workspace}` },
        { title: `${props.type} editor` },
      ]}
    />
  );
};

export default EditorHeader;
