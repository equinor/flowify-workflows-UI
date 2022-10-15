import { IOption } from './select/types';

export function createOptionsFromSingleValue(list: string[]): IOption[] {
  const options = list?.map((item) => ({ label: item, value: item }));
  return options || [];
}

export function createOptionsFromObjectValue(list: any[] | undefined, key: string): IOption[] {
  const options = list?.map((item) => ({ label: item[key], value: item[key] }));
  return options || [];
}
