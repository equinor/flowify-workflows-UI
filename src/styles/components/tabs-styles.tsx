import styled from 'styled-components';
import { Tabs as UITabs } from '@equinor/eds-core-react';

export const Tabs = styled(UITabs)`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-grow: 1;
`;

export const Tab = styled(UITabs.Tab)`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`;

export const TabList = styled(UITabs.List)`
  overflow-x: visible;
`;

export const TabPanels = styled(UITabs.Panels)`
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
`;

export interface IStyledPanel {
  padded?: boolean;
}

export const TabPanel = styled(UITabs.Panel)<IStyledPanel>`
  height: 100%;
  width: 100%;
  padding: ${(props) => (props.padded ? '1rem' : '0')};
`;
