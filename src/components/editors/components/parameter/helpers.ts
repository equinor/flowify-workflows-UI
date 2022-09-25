import { Arg, Data, Port, Result } from '../../../../models/v2';
import { isNotEmptyArray } from '../../../../common';

function getMediaType(value: string | undefined, mediatypes: string[] | undefined) {
  if (value === 'parameter' || value === 'parameter_array') {
    return mediatypes;
  }
  if (value === 'env_secret') {
    return ['env_secret'];
  }
  if (value === 'artifact') {
    return ['file'];
  }
  if (value === 'volume') {
    return ['volume'];
  }
  return [];
}

function updateParameter(list: Data[] | undefined, index: number, parameter: Data, values: any) {
  if (!list) {
    return [];
  }
  list[index] = {
    ...parameter,
    name: values?.name,
    type: values?.type,
    mediatype: getMediaType(values?.type, values?.mediatype),
    userdata: {
      ...parameter?.userdata,
      value: values?.value,
    },
  };
  return list;
}

function updateArgs(args: Arg[] | undefined, prevName: string, type: string, parameter: Data): Arg[] {
  if (isNotEmptyArray(args) && type === 'input') {
    const updated = args?.map((arg) =>
      (arg?.source as Port)?.port === prevName
        ? { ...arg, source: { port: parameter.name }, target: { ...arg.target, type: parameter.type } }
        : arg,
    );
    return updated || [];
  }
  return args || [];
}

function updateResults(results: Result[] | undefined, prevName: string, type: string, parameter: Data): Result[] {
  if (isNotEmptyArray(results) && type === 'output') {
    const updated = results!.map((result) =>
      result?.target?.port === prevName ? { ...result, target: { ...result?.target, port: parameter?.name } } : result,
    );
    return updated;
  }
  return results || [];
}

export { updateArgs, updateParameter, updateResults };
