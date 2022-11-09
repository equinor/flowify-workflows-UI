import React from 'react';

export interface ISection {
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

export interface DashboardListingProps {
  sections: ISection[];
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}
