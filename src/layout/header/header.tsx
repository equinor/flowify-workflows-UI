import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import { useWorkspaces } from '@common';
import { Stack } from '@ui';
import { TopBar, IconsWrapper } from './styles';


interface IHeader {}

const Header: FC<IHeader> = (props: IHeader) => {
  const { hasAnyAdminAccess } = useWorkspaces();
  return (
    <TopBar>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Link to="/dashboard">
          <Icon name="waves" size={32} />
        </Link>
        <Typography variant="h3" as="span">
          Flowify
        </Typography>
      </Stack>
      <IconsWrapper>
        <Link title="Marketplace" to="/components" className="ff-header__link">
          <Icon name="mall" size={24} />
        </Link>
        {hasAnyAdminAccess && (
          <Link title="Admin page" to="/admin" className="ff-header__link">
            <Icon name="verified_user" size={24} />
          </Link>
        )}
        <Link title="User profile" to="/user" className="ff-header__link">
          <Icon name="account_circle" size={24} />
        </Link>
      </IconsWrapper>
    </TopBar>
  );
};

export default Header;
