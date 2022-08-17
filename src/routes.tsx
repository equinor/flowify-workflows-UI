import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WorkspaceAuth } from './auth';
import {
  ComponentPage,
  ComponentsPage,
  DashboardPage,
  JobPage,
  JobsPage,
  Page404NotFound,
  AdminPage,
  UserInfoPage,
  WorkflowPage,
  WorkflowsPage,
  WorkspacePage,
} from './pages';

interface IPages {}

export default function Pages(props: IPages) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/workspace/:workspace"
          element={
            <WorkspaceAuth>
              <WorkspacePage />
            </WorkspaceAuth>
          }
        />
        <Route
          path="/workspace/:workspace/workflow/:workflow"
          element={
            <WorkspaceAuth>
              <WorkflowPage />
            </WorkspaceAuth>
          }
        />
        <Route
          path="/workspace/:workspace/workflows"
          element={
            <WorkspaceAuth>
              <WorkflowsPage />
            </WorkspaceAuth>
          }
        />
        <Route
          path="/workspace/:workspace/job/:id"
          element={
            <WorkspaceAuth>
              <JobPage />
            </WorkspaceAuth>
          }
        />
        <Route
          path="/workspace/:workspace/jobs"
          element={
            <WorkspaceAuth>
              <JobsPage />
            </WorkspaceAuth>
          }
        />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/component/:component" element={<ComponentPage />} />
        <Route path="/user" element={<UserInfoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Page404NotFound />} />
      </Routes>
    </Router>
  );
}
