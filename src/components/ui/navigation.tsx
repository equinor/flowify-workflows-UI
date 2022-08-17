import React, { FC, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TabsProps,
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProps,
} from '@equinor/eds-core-react/dist/types/components/Tabs';
import { addTheme } from '.';
import * as S from '../../styles/components';

/**
 * Page navigation
 */

export const Breadcrumbs = (props: { children: React.ReactNode }) =>
  addTheme(<S.Breadcrumbs>{props.children}</S.Breadcrumbs>);

/**
 * Tabs Components
 */

const Tabs = (props: TabsProps) => addTheme(<S.Tabs {...props} />);

const TabList: FC<TabListProps> = forwardRef((props: TabListProps, ref) =>
  addTheme(<S.TabList {...props}>{props.children}</S.TabList>),
);

const TabPanels: FC<TabPanelsProps> = (props: TabPanelsProps) => addTheme(<S.TabPanels {...props} />);

const TabPanel: FC<TabPanelProps & S.IStyledPanel> = (props: TabPanelProps & S.IStyledPanel) =>
  addTheme(<S.TabPanel {...props} />);

const Tab: FC<TabProps> = forwardRef((props: TabProps, ref) => addTheme(<S.Tab {...props} />));

export { Tabs, TabList, TabPanels, TabPanel, Tab };

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
