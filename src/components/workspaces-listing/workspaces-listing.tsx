import React, { FC, useEffect, useState } from 'react';
import { Icon, Progress } from '@equinor/eds-core-react';
import { services } from '@services';
import { Workspace } from '@models/v2';
import { useUser } from '@common';
import { DashboardListing } from '../dashboard-listing/dashboard-listing';
import { CreateWorkspace } from '../../components';

interface IWorkspacesListing {}

const WorkspacesListing: FC<IWorkspacesListing> = (props: IWorkspacesListing) => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = useState<boolean>(false);

  const { checkIfUserIsWorkspaceViewer, checkIfUserIsWorkspaceCreator } = useUser();

  useEffect(() => {
    function createWorkspacesLinkList(items: Workspace[]) {
      const list = items
        .filter((item) => checkIfUserIsWorkspaceViewer(item))
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
  }, [checkIfUserIsWorkspaceViewer]);

  const showCreateWorkspaceButton = checkIfUserIsWorkspaceCreator();

  return (
    <div>
      {loadingWorkspaces ? (
        <Progress.Dots />
      ) : (
        <>
          <CreateWorkspace open={newWorkspaceOpen} setOpen={setNewWorkspaceOpen} />
          <DashboardListing
            title="Workspaces"
            icon={<Icon name="dashboard" size={24} color="#709DA0" />}
            sections={[
              { linklist: !showCreateWorkspaceButton ? [] : [
                  { 
                    title: 'Create new workspace',
                    icon: 'add',
                    button: true,
                    onClick: () => setNewWorkspaceOpen(true),
                  },
                ],
              },
              { title: 'Your workspaces', linklist: workspaces },
              {
                title: 'Workspaces documentation',
                linklist: [
                  {
                    title: 'Creating a workspace',
                    url: 'https://equinor.github.io/flowify-documentation/workspaces/',
                    target: '_blank',
                    external: true,
                  },
                  {
                    title: 'Configure workspace secrets',
                    url: 'https://equinor.github.io/flowify-documentation/secrets/',
                    target: '_blank',
                    external: true,
                  },
                ],
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default WorkspacesListing;
