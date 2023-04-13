import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserInfo, Workspace, WorkspaceOwnership } from '@models/v2';
import { services } from '@services';
import { checkWorkspaceHasRole, checkWorkspaceHasSomeRole } from '@common';

export const initialUserState: UserInfo = {
  name: '',
  email: '',
  roles: [],
};

interface IUserProps {
  userInfo: UserInfo;
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
  checkIfUserIsWorkspaceCreator: Function;
  checkIfUserIsWorkspaceEditor: Function;
  checkIfUserIsWorkspaceViewer: Function;
  checkIfUserIsComponentCreator: Function;
  checkIfUserIsWorkflowCreator: Function;
}

export const UserContextStore = React.createContext({} as IUserProps);

export function CurrentUserProvider(props: any) {
  const [userInfo, setUserInfo] = useState(initialUserState);

  const { email, roles } = userInfo;

  // Custom workspace roles
  const roleOwner = `${email}--$${WorkspaceOwnership.Owner}`;
  const roleCollaborator = `${email}--$${WorkspaceOwnership.Collaborator}`

  useEffect(() => {
    services.userinfo
      .getUserInfo()
      .then((x) => setUserInfo(x))
      .catch((e) => {});
  }, []);
  
  const isDevMode = process.env.NODE_ENV === 'development';

  const isSuperAdmin = roles.includes('admin');
  const isDeveloperAdmin = roles.includes('developer-admin');
  const isDeveloper = roles.includes('developer');
  const isUser = roles.includes('user');
  const isSandboxDev = roles.includes('sandbox-developer');

  const isValidUser = isSuperAdmin || isDeveloperAdmin || isDeveloper || isUser || isSandboxDev;

  // Workspace
  const checkIfUserIsWorkspaceCreator = () => isValidUser && isDevMode
    ? isSandboxDev
    : isSuperAdmin || isDeveloperAdmin;

  const checkIfUserIsWorkspaceEditor = (workspace: Workspace) => isValidUser && isDevMode
    ? isSandboxDev && checkWorkspaceHasRole(workspace, roleOwner)
    : (isSuperAdmin || (isDeveloperAdmin && checkWorkspaceHasRole(workspace, roleOwner)));

  const checkIfUserIsWorkspaceViewer = (workspace: Workspace) => isValidUser && isDevMode
      ? isSandboxDev && checkWorkspaceHasSomeRole(workspace, [roleOwner, roleCollaborator])
      : isSuperAdmin || checkWorkspaceHasSomeRole(workspace, [roleOwner, roleCollaborator]);

  // Component
  const checkIfUserIsComponentCreator = () => isValidUser && isDevMode
  ? isSandboxDev
  : isSuperAdmin || isDeveloperAdmin || isDeveloper;

  // Workflow
  const checkIfUserIsWorkflowCreator = (workspace: Workspace) => isValidUser && isDevMode
  ? isSandboxDev && checkWorkspaceHasSomeRole(workspace, [roleOwner])
  : isSuperAdmin || ((isDeveloperAdmin || isDeveloper) && checkWorkspaceHasSomeRole(workspace, [roleOwner]));

  const value = {
    userInfo,
    setUserInfo,
    // workspaces
    checkIfUserIsWorkspaceCreator,
    checkIfUserIsWorkspaceEditor,
    checkIfUserIsWorkspaceViewer,
    // component
    checkIfUserIsComponentCreator,
    // workflows
    checkIfUserIsWorkflowCreator,
  };
  

  return <UserContextStore.Provider value={value}>{props.children}</UserContextStore.Provider>;
}

export function useUser() {
  return React.useContext(UserContextStore);
}
