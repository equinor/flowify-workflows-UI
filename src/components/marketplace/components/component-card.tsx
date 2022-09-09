import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { Chip, Icon, Typography } from '@equinor/eds-core-react';
import { Link } from 'react-router-dom';
import { ComponentCard as Card, ComponentIcon, Button } from '../../ui';
import { Component } from '../../../models/v2';
import { Timestamp } from '../../timestamp';
import moment from 'moment';

interface IComponentCard {
  component: Component;
  children?: React.ReactNode;
}

export const ComponentCard: FC<IComponentCard> = (props: IComponentCard) => {
  const { component, children } = props;

  const today = moment().startOf('day').hour(12);

  return (
    <Card>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <div>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ComponentIcon />
              {today.diff(component.timestamp, 'days') < 3 ? <Icon name="new_label" size={32} color="#004f55" /> : null}
            </Stack>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center">
                <Typography variant="body_short_bold">{component.name}</Typography>
                <Chip style={{ fontSize: '1rem' }}>v{component?.version?.current}</Chip>
              </Stack>
              <Typography variant="caption">
                Last updated: <Timestamp date={component?.timestamp} />{' '}
                {component?.modifiedBy ? <>by {component?.modifiedBy}</> : ''}
              </Typography>
            </Stack>
            <Typography variant="body_short">{component?.description}</Typography>
            <Button theme="simple">
              <Link to={`/component/${component?.uid}/${component?.version?.current}`}>View component</Link>
              <Icon name="chevron_right" size={16} color="#004f55" />
            </Button>
          </Stack>
        </div>
        {children ? children : null}
      </Stack>
    </Card>
  );
};
