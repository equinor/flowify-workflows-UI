import { customAlphabet } from 'nanoid';

// RFC1123 alphanumeric + hyphen, we skip hyphen because cant appear at start or end
export function nanoid(len: number) {
  const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  const numbers: string = '0123456789';
  return customAlphabet(lowercase + numbers /* + '-'  exclude hyphen */, len)();
}

export function isNotEmptyArray(array: any[] | undefined): boolean {
  return Array.isArray(array) && array.length > 0;
}

export function uuid(): string {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
