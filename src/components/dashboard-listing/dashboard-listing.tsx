import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Button, Paper, Stack } from '@ui';
import { DashboardListingProps } from './types';

/**
 * Dashboard listing
 * Used to lessen code of UI elements for link and content listings on dashboard
 */
export const DashboardListing: FC<DashboardListingProps> = (props: DashboardListingProps) => {
  const { sections, title, icon } = props;
  return (
    <Paper padding={2}>
      <Stack justifyContent="stretch">
        <Stack
          direction="row"
          spacing={1}
          style={{ flexGrow: '1', height: '100%' }}
          alignItems="center"
          justifyContent="flex-start"
        >
          {icon ? <Stack padding={1}>{icon}</Stack> : null}
          <Typography variant="h3">{title}</Typography>
        </Stack>
        <Stack style={{ flexGrow: '1' }} spacing={2}>
          {sections.map((section, index) => (
            <Stack spacing={1} key={`${section.title}_${index}`}>
              <Typography variant="h6">{section.title}</Typography>
              <Stack direction="row" wrap="wrap" style={{ maxWidth: '970px', columnGap: '1rem' }}>
                {section.linklist?.map((item) =>
                  item.external ? (
                    <Button key={item.url} href={item.url} target={item.target} rel="noopener noreferrer" theme="link">
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
                    <Link key={item.url} to={item.url!} target={item.target} style={{ display: 'contents' }}>
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
