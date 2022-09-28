import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserInfo } from '../../models/v2';
import { services } from '../../services';

export const initialUserState: UserInfo = {
  name: '',
  email: '',
  roles: [],
};

interface IUserProps {
  userInfo: UserInfo;
  // dispatch: Dispatch<Actions>;
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
}

export const UserContextStore = React.createContext({} as IUserProps);

export function CurrentUserProvider(props: any) {
  const [userInfo, setUserInfo] = useState(initialUserState);
  const value = { userInfo, setUserInfo };

  useEffect(() => {
    services.userinfo
      .getUserInfo()
      .then((x) => setUserInfo(x))
      .catch((e) => {});
  }, []);

  return <UserContextStore.Provider value={value}>{props.children}</UserContextStore.Provider>;
}
