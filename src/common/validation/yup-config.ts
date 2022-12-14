import * as yup from 'yup';
import { noWhitespace, startsWithLetter } from './methods';

declare module 'yup' {
  interface StringSchema {
    startsWithLetter(message?: string): yup.StringSchema;
    noWhitespace(message?: string): yup.StringSchema;
    validSecret(type: 'workflow' | 'component', secrets: string[], message?: string): yup.StringSchema;
    validVolume(type: 'workflow' | 'component', volumes: string[], message?: string): yup.StringSchema;
    noDuplicateValues(list: string[], oldValue: string | undefined, message?: string): yup.StringSchema;
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

yup.addMethod(yup.string, 'validSecret', function (type, secrets, message) {
  return this.test('validSecret', message, function (value) {
    // @ts-expect-error
    const { from } = this;
    if (type === 'component') {
      return true;
    }
    if (!(from[1]?.value?.type === 'env_secret')) {
      return true;
    }
    if (secrets.includes(value)) {
      return true;
    }
    const [nodeid, ...rest] = from[1]?.value?.name?.split('-');
    throw this.createError({
      path: this.path,
      message: `Secret chosen for node with id «${nodeid}»: input «${rest.join(
        '-',
      )}» references a workspace secret that does not exist. The secret may have been deleted. Please re-select a valid secret.`,
      params: {
        nodeid,
      },
    });
  });
});

yup.addMethod(yup.string, 'validVolume', function (type, volumes, message) {
  return this.test('validVolume', message, function (value) {
    // @ts-expect-error
    const { from } = this;
    if (type === 'component') {
      return true;
    }
    if (!(from[1]?.value?.type === 'volume')) {
      return true;
    }
    if (volumes.includes(value)) {
      return true;
    }
    const [nodeid, ...rest] = from[1]?.value?.name?.split('-');
    throw this.createError({
      path: this.path,
      message: `Volume chosen for node with id «${nodeid}»: input «${rest?.join(
        '-',
      )}» references a workspace volume that does not exist. The volume may have been deleted. Please re-select a valid volume.`,
      params: {
        nodeid,
      },
    });
  });
});

yup.addMethod(yup.string, 'noDuplicateValues', function (list: string[], oldValue: string, message) {
  return this.test('noDuplicateValues', message || 'Value already exists', function (value) {
    if (!value) {
      return true;
    }
    if (value === oldValue) {
      return true;
    }
    if (list?.includes(value)) {
      return false;
    }
    return true;
  });
});
