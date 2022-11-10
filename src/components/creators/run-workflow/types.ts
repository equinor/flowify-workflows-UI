import { Workflow } from '@models/v2';
import { ButtonProps } from '@ui';

export interface RunWorkflowProps {
  // Pass the entire workflow object or a string (uid)
  workflow: Workflow | string;
  secrets?: string[];
  buttonProps?: ButtonProps;
}
