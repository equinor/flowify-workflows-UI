import React from 'react';
import { addTheme } from '.';
import * as S from '../../styles/components';

export const WorkspaceCard = (props: { children: React.ReactNode; isLink?: boolean }) =>
  addTheme(<S.WorkspaceCard isLink={props.isLink}>{props.children}</S.WorkspaceCard>);

export const ComponentCard = (props: { children: React.ReactNode }) =>
  addTheme(<S.ComponentCard>{props.children}</S.ComponentCard>);

export const Paper = (props: { children?: React.ReactNode; padded?: boolean }) =>
  addTheme(<S.Paper padded={props.padded}>{props.children}</S.Paper>);
