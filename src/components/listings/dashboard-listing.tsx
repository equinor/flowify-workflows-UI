import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button, Paper } from '../ui';

interface ISection {
  title?: string;
  linklist?: {
    title: string;
    url?: string;
    target?: string;
    external?: boolean;
    icon?: string;
    button?: boolean;
    onClick?: any;
  }[];
}

interface DashboardListingProps {
  sections: ISection[];
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export const DashboardListing: FC<DashboardListingProps> = (props: DashboardListingProps) => {
  const { sections, title, icon } = props;
  return (
    <Paper padding={2}>
      <Stack sx={{ justifyContent: 'stretch' }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: '1', height: '100%' }}
          alignItems="center"
          justifyContent="flex-start"
        >
          {icon ? <Stack sx={{ padding: '1rem' }}>{icon}</Stack> : null}
          <Typography variant="h3">{title}</Typography>
        </Stack>
        <Stack sx={{ flexGrow: '1' }} spacing={4}>
          {sections.map((section, index) => (
            <Stack spacing={1} key={`${section.title}_${index}`}>
              <Typography variant="h6">{section.title}</Typography>
              <Stack direction="row" columnGap={3} rowGap={1} flexWrap="wrap" sx={{ maxWidth: '970px' }}>
                {section.linklist?.map((item) =>
                  item.external ? (
                    <Button
                      key={item.url}
                      href={item.url}
                      target={item.target}
                      rel="noopener noreferrer"
                      theme="simple"
                    >
                      {item.icon && <Icon name={item.icon} size={16} color="#004f55" />}
                      <span>{item.title}</span> <Icon name="chevron_right" size={16} color="#004f55" />
                    </Button>
                  ) : item.button ? (
                    <Button key={item.title} theme="create" onClick={item.onClick}>
                      {item.icon && <Icon name={item.icon} size={16} color="#004f55" />}
                      <span>{item.title}</span>{' '}
                      <Icon name="chevron_right" size={16} color="#004f55" style={{ marginRight: '0.5rem' }} />
                    </Button>
                  ) : (
                    <Link key={item.url} to={item.url!} target={item.target}>
                      <Button as="span">
                        {item.icon && (
                          <Icon name={item.icon} size={16} color="#004f55" style={{ marginRight: '0.5rem' }} />
                        )}
                        <span>{item.title}</span> <Icon name="chevron_right" size={16} color="#004f55" />
                      </Button>
                    </Link>
                  ),
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
        {props.children ? props.children : null}
      </Stack>
    </Paper>
  );
};
