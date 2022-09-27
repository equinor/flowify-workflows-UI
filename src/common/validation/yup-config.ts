import * as yup from 'yup';
import { noWhitespace, startsWithLetter } from './methods';

declare module 'yup' {
  interface StringSchema {
    startsWithLetter(message?: string): yup.StringSchema;
    noWhitespace(message?: string): yup.StringSchema;
  }
  interface ArraySchema<T> {
    unique(mapper: (a: T) => T, message?: any): ArraySchema<T>;
  }
  interface ObjectSchema<TShape, TContext, TIn, TOut> {
    uniqueProperty(propertyName: string, message?: any): ObjectSchema<TShape, TContext, TIn, TOut>;
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

yup.addMethod(yup.array, 'unique', function (mapper = (a: any) => a, message: string) {
  return this.test('unique', message, (list) => {
    return list?.length === new Set(list?.map(mapper)).size;
  });
});

yup.addMethod(yup.object, 'uniqueProperty', function (propertyName, message) {
  return this.test('unique', message, function (value) {
    if (!value || !value[propertyName]) {
      return true;
    }

    if (this.parent.filter((v: any) => v !== value).some((v: any) => v[propertyName] === value[propertyName])) {
      throw this.createError({
        path: `${this.path}.${propertyName}`,
        params: {
          parsedValue: value?.[propertyName],
        },
      });
    }

    return true;
  });
});
