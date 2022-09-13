import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { addTheme } from '.';
import * as S from '../../styles/components';

/**
 * Page navigation
 */

export const Breadcrumbs = (props: { children: React.ReactNode }) =>
  addTheme(<S.Breadcrumbs>{props.children}</S.Breadcrumbs>);

/**
 * Headers
 */
interface IWorkspaceHeader {
  workspace: string;
}
export const WorkspaceHeader: FC<IWorkspaceHeader> = (props: IWorkspaceHeader) => {
  const { workspace } = props;
  return (
    <>
      <Breadcrumbs>
        <Link to="/dashboard">Dashboard</Link>
        <span>
          <b>{workspace}</b>
        </span>
      </Breadcrumbs>
    </>
  );
};
