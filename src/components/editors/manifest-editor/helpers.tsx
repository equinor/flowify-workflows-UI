import jsyaml from 'js-yaml';
import { Languages } from './types';

function parse<T>(value: string): T {
  if (value.startsWith('{')) {
    return JSON.parse(value);
  }
  return jsyaml.load(value) as T;
}

function stringify<T>(value: T, lang: Languages): string {
  return lang === 'yaml' ? jsyaml.dump(value, { noRefs: true }) : JSON.stringify(value, null, '  ');
}

export { parse, stringify };
