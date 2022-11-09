import React from 'react';
import { Component } from '@models/v2';
import { BUTTON_STATE } from '../../../marketplace/add-button/types';

export interface MarketplaceModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onAddComponent: (component: Component, setButtonState: React.Dispatch<React.SetStateAction<BUTTON_STATE>>) => void;
  component: Component | undefined;
  setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>;
  subcomponents: Component[] | undefined;
}
