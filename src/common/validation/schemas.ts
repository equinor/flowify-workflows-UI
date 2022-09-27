import * as Yup from 'yup';
export function DATA_VALIDATION(type: 'component' | 'workflow', secrets?: string[]) {
  return Yup.array()
    .of(
      Yup.object({
        name: Yup.string()
          .required()
          .startsWithLetter(
            'Parameters (inputs, outputs, secrets and volumes) needs to start with alphabetical letters [a…z]',
          )
          .noWhitespace("Parameters can't contain any whitespace"),
        mediatype: Yup.array().of(Yup.string().oneOf(['string', 'integer', 'file', 'volume', 'env_secret'])),
        type: Yup.string().required().oneOf(['parameter', 'artifact', 'env_secret', 'volume', 'parameter_array']),
        userdata: Yup.object({
          value: Yup.string(),
          description: Yup.string(),
        }),
      }).uniqueProperty('name', 'Input name is duplicate. Name has to be a unique value.'),
    )
    .nullable();
}
