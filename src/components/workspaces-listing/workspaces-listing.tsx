import React, { FC, useEffect, useState } from 'react';
import { Icon, Progress } from '@equinor/eds-core-react';
import { services } from '../../services';
import { Workspace } from '../../models/v2';
import { DashboardListing } from '../listings/dashboard-listing';

interface IWorkspacesListing {}

const WorkspacesListing: FC<IWorkspacesListing> = (props: IWorkspacesListing) => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  useEffect(() => {
    function createWorkspacesLinkList(items: Workspace[]) {
      const list = items
        .filter((item) => item.hasAccess)
        .map((item) => ({ title: item.name, url: `/workspace/${item.name}` }));
      return list;
    }

    services.workspace
      .list()
      .then((res) => {
        if (Array.isArray(res?.items)) {
          setWorkspaces(createWorkspacesLinkList(res.items));
        }
        setLoadingWorkspaces(false);
      })
      .catch((error) => {
        setLoadingWorkspaces(false);
        console.error(error);
      });
  }, []);

  return (
    <div>
      {loadingWorkspaces ? (
        <Progress.Dots />
      ) : (
        <DashboardListing
          title="Workspaces"
          icon={<Icon name="dashboard" size={24} color="#709DA0" />}
          sections={[
            { linklist: workspaces },
            {
              title: 'Workspaces documentation',
              linklist: [
                {
                  title: 'Creating a workspace',
                  url: 'https://equinor.github.io/flowify-documentation/docs/workspace/',
                  target: '_blank',
                  external: true,
                },
                {
                  title: 'Configure workspace secrets',
                  url: 'https://equinor.github.io/flowify-documentation/docs/secret/',
                  target: '_blank',
                  external: true,
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default WorkspacesListing;
