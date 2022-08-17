import React, { FC, useState, useRef } from 'react';
import { Button, Icon, TopBar, Popover, Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import { FlowifyIcon, IconsWrapper } from '../../components/ui';

interface IHeader {}

const Header: FC<IHeader> = (props: IHeader) => {
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const notifsAnchor = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <TopBar>
        <TopBar.Header>
          <Link to="/dashboard">
            <FlowifyIcon name="waves" size={32} />
          </Link>
          <Typography variant="h3" as="span">
            Flowify
          </Typography>
        </TopBar.Header>
        <TopBar.CustomContent></TopBar.CustomContent>
        <TopBar.Actions>
          <IconsWrapper>
            <Link to="/components" className="ff-header__link">
              <Icon name="mall" size={24} color="primary" />
            </Link>
            <Button
              variant="ghost_icon"
              aria-haspopup="true"
              aria-controls="notifications-popover"
              ref={notifsAnchor}
              onClick={() => setNotifsVisible((prev) => !prev)}
            >
              <Icon name="notifications" size={24} color="primary" />
            </Button>
            <Popover
              id="notifications-popover"
              aria-expanded={notifsVisible}
              anchorEl={notifsAnchor.current}
              onClose={() => setNotifsVisible(false)}
              open={notifsVisible}
            >
              <Popover.Title>&nbsp;</Popover.Title>
              <Popover.Content>
                <Typography variant="body_short">No notifications yet</Typography>
              </Popover.Content>
            </Popover>
            <Link to="/admin" className="ff-header__link">
              <Icon name="verified_user" size={24} color="primary" />
            </Link>
            <Link to="/user" className="ff-header__link">
              <Icon name="account_circle" size={24} title="User profile" color="primary" />
            </Link>
          </IconsWrapper>
        </TopBar.Actions>
      </TopBar>
    </div>
  );
};

export default Header;
