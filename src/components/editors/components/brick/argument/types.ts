import { Arg, Component, Data } from '../../../../../models/v2';

export const TYPE_ICONS = {
  parameter: 'swap_horizontal',
  artifact: 'file',
  env_secret: 'security',
};

export interface ArgumentProps {
  arg: Arg;
  inputs?: Data[];
  index: number;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
}
