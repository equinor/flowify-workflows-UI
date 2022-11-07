import { Icon } from '@equinor/eds-core-react';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { isNotEmptyArray } from '@common';
import { StyledBreadcrumbs } from './styles';

interface BreadcrumbsProps {
  links?: { title: string; href?: string }[];
  children?: React.ReactNode;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = (props: BreadcrumbsProps) => {
  const { links, children } = props;
  return (
    <StyledBreadcrumbs aria-label="breadcrumbs">
      {isNotEmptyArray(links) && (
        <ol>
          {links?.map((link) =>
            link?.href ? (
              <li key={link?.href}>
                <Link to={link?.href}>{link?.title}</Link>
                <Icon name="chevron_right" size={16} />
              </li>
            ) : (
              <li key={link?.title}>
                <span>{link?.title}</span>
              </li>
            ),
          )}
        </ol>
      )}
      {children && children}
    </StyledBreadcrumbs>
  );
};
