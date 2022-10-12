type ActiveType = 'editor' | 'document' | 'runs';
export interface EditorMenuProps {
  active: ActiveType;
  setActive: (type: ActiveType) => void;
  isWorkflow?: boolean;
  onSave: () => void;
  dirty: boolean;
  openValidation?: () => void;
  errorsLength?: number;
}
