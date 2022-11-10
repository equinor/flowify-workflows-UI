import { Component } from '@models/v2';

export type BUTTON_STATE = 'default' | 'loading' | 'success' | 'error';

export interface AddButtonProps {
  component: Component;
  onAddComponent: (component: Component, setButtonState: React.Dispatch<React.SetStateAction<BUTTON_STATE>>) => void;
}
