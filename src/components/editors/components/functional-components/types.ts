import React from 'react';
import { Component } from '@models/v2';

export interface FunctionalComponentsProps {
  onClose: any;
  component?: Component;
  subComponents?: Component[];
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
}
export type COMPONENT_IDS = 'map' | 'if';

interface IFunctionalComponent {
  id: COMPONENT_IDS;
  name: string;
  type: 'map' | 'conditional';
  description: string;
  onAdd: string;
}

export const FUNCTIONAL_COMPONENTS: IFunctionalComponent[] = [
  {
    id: 'map',
    name: 'Map component',
    type: 'map',
    description: 'Wrap component in a map and use parameter arrays to run it multiple times when running jobs.',
    onAdd: 'onAddMap',
  },
  /*   {
    id: 'if',
    name: 'If component',
    type: 'conditional',
    description:
      'Select component to run if condition is true, additionally select component to run if condition is false',
    onAdd: 'onAddIf',
  }, */
];
