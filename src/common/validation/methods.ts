export function isOnlyDigits(value: string) {
  return /^\d+$/.test(value);
}

export function startsWithLetter(value: string | undefined) {
  return value ? /[a-z]/i.test(value.charAt(0)) : true;
}

export function noWhitespace(value: string | undefined) {
  return value ? !value.includes(' ') : true;
}
