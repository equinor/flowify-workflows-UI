import * as yup from 'yup';
import { noWhitespace, startsWithLetter } from './methods';

declare module 'yup' {
  interface StringSchema {
    startsWithLetter(message?: string): yup.StringSchema;
    noWhitespace(message?: string): yup.StringSchema;
  }
}

yup.addMethod(yup.string, 'startsWithLetter', function (message) {
  return this.test(
    'startsWithLetter',
    message || 'Text needs to start with alpabetical letters [a…z]',
    startsWithLetter,
  );
});

yup.addMethod(yup.string, 'noWhitespace', function (message) {
  return this.test('noWhitespace', message || 'Whitespace is not allowed', noWhitespace);
});
