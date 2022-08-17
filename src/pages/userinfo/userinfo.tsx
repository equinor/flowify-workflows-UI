import React, { useContext } from 'react';
import { Avatar, Stack } from '@mui/material';
import { List, Typography } from '@equinor/eds-core-react';
import { UserContextStore } from '../../common/context/user-context-store';
import { Container, Layout } from '../../layout';

const initials = (name: string): string => {
  if (!Array.isArray(name)) {
    return '';
  }
  const names = [...name.split(' ')] || [];
  const is: string = ((names.shift()?.[0] || '') + (names.pop()?.[0] || '')).toUpperCase();
  return is;
};

interface UserInfoPageProps {}

export const UserInfoPage: React.FC<UserInfoPageProps> = (props: UserInfoPageProps) => {
  const { userInfo: user } = useContext(UserContextStore);

  return (
    <Layout>
      <Container withMargins>
        {user && (
          <Stack spacing={4}>
            <div style={{ display: 'flex', alignItems: 'center', columnGap: '2rem' }}>
              <Avatar>{initials(user.name)}</Avatar>
              <Typography variant="h2">{user.name}</Typography>
            </div>
            <div>
              <Typography variant="h5" as="h3">
                Name
              </Typography>
              <Typography>{user.name}</Typography>
            </div>
            <div>
              <Typography variant="h5" as="h3">
                Email
              </Typography>
              <Typography>{user.email}</Typography>
            </div>
            <div>
              <Typography variant="h5" as="h3">
                Groups
              </Typography>
              <List>
                {user.roles?.map((group) => (
                  <List.Item key={group}>{group}</List.Item>
                ))}
              </List>
            </div>
          </Stack>
        )}
      </Container>
    </Layout>
  );
};
