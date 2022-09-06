import { Data, Component, DataTypes } from '../../../../models/v2';

export interface ParameterProps {
  parameter: Data;
  index: number;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  type: 'input' | 'output';
  secrets?: string[];
  editableValue?: boolean;
  onlyEditableValue?: boolean;
  secret?: boolean;
  volume?: boolean;
}

const TYPE_ICONS = {
  parameter: 'swap_horizontal',
  artifact: 'file',
  env_secret: 'security',
  parameter_array: 'list',
};

const MEDIATYPES = ['string', 'integer', 'env_variable'];

const TYPES: DataTypes[] = ['parameter', 'artifact', 'parameter_array'];

export { TYPE_ICONS, MEDIATYPES, TYPES };
