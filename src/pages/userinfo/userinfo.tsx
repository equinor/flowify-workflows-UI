import React, { useContext } from 'react';
import { Avatar, Stack } from '@mui/material';
import { List, Typography } from '@equinor/eds-core-react';
import { UserContextStore } from '../../common/context/user-context-store';
import { Container, Layout } from '../../layout';
import { Helmet } from 'react-helmet-async';
import { SettingsContextStore } from '../../common/context/editor-settings-context';
import { MultiToggle, ToggleButton } from '../../components/ui';

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
  const { settings, updateSetting } = useContext(SettingsContextStore);

  return (
    <Layout>
      <Helmet>
        <title>{user?.name} - Flowify</title>
      </Helmet>
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
            <MultiToggle label="Theme">
              <ToggleButton active={settings?.darkTheme} onClick={() => updateSetting('darkTheme', true)}>
                Dark
              </ToggleButton>
              <ToggleButton active={!settings?.darkTheme} onClick={() => updateSetting('darkTheme', false)}>
                Light
              </ToggleButton>
            </MultiToggle>
            <MultiToggle label="Default manifest language">
              <ToggleButton active={settings?.language === 'yaml'} onClick={() => updateSetting('language', 'yaml')}>
                YAML
              </ToggleButton>
              <ToggleButton active={settings?.language === 'json'} onClick={() => updateSetting('language', 'json')}>
                JSON
              </ToggleButton>
            </MultiToggle>
          </Stack>
        )}
      </Container>
    </Layout>
  );
};
