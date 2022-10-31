import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ComponentIcon, Button, Paper, Chip, Stack } from '../../ui';
import { Component } from '../../../models/v2';
import { Timestamp } from '../../timestamp';

interface IComponentCard {
  component: Component;
  children?: React.ReactNode;
}

export const ComponentCard: FC<IComponentCard> = (props: IComponentCard) => {
  const { component, children } = props;

  const today = moment().startOf('day').hour(12);

  return (
    <Paper theme="light" padding={1.5} style={{ height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}>
        <div>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ComponentIcon />
              {today.diff(component.timestamp, 'days') < 3 ? <Icon name="new_label" size={32} color="#004f55" /> : null}
            </Stack>
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body_short_bold">{component.name}</Typography>
                <Chip>v{component?.version?.current}</Chip>
              </Stack>
              <Typography variant="caption">
                Last updated: <Timestamp date={component?.timestamp} />{' '}
                {component?.modifiedBy?.email ? <>by {component?.modifiedBy?.email}</> : ''}
              </Typography>
            </Stack>
            <Typography variant="body_short">{component?.description}</Typography>
            <Link to={`/component/${component?.uid}/${component?.version?.current}`}>
              <Button theme="link" as="span">
                View component
                <Icon name="chevron_right" size={16} color="#004f55" />
              </Button>
            </Link>
          </Stack>
        </div>
        {children ? children : null}
      </Stack>
    </Paper>
  );
};
