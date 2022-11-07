import { Arg, Component, Data } from '@models/v2';

export interface ArgumentEditorProps {
  arg: Arg;
  isConst: boolean;
  index: number;
  open: boolean;
  onClose: () => void;
  setComponent: React.Dispatch<React.SetStateAction<Component | undefined>>;
  inputs: Data[];
  selectValue: string | undefined;
  setSelectValue: (value: string) => void;
  type: string;
}
