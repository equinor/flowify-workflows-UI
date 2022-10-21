import { BaseSelectProps } from '../select/types';

export interface MultiSelectProps extends BaseSelectProps {
  onChange?: (items: string[]) => void;
  value?: string[] | undefined;
  addValue?: (item: string) => void;
  removeValue?: (index: number) => void;
}
