export type Languages = 'json' | 'yaml';
export const DEFAULT_LANGUAGE: Languages = 'json';

export interface IError {
  message: string;
  name: string;
  reason: string;
}

export interface ManifestEditorProps {
  value: any;
  lang?: Languages;
  onChange?: (value: any) => void;
}
