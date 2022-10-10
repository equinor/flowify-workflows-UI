import * as Yup from 'yup';
export function DATA_VALIDATION(type: 'component' | 'workflow', secrets?: string[]) {
  return Yup.array()
    .of(
      Yup.object({
        name: Yup.string()
          .required('Parameter name is a required field')
          .startsWithLetter(
            'Parameters (inputs, outputs, secrets and volumes) needs to start with alphabetical letters [a…z]',
          )
          .noWhitespace("Parameters can't contain any whitespace"),
        mediatype: Yup.array().of(Yup.string().oneOf(['string', 'integer', 'file', 'volume', 'env_secret'])),
        type: Yup.string().required().oneOf(['parameter', 'artifact', 'env_secret', 'volume', 'parameter_array']),
        userdata: Yup.object({
          value: Yup.string().validSecret(type, secrets || []),
          description: Yup.string(),
        }),
      }).uniqueProperty('name', 'Input name is duplicate. Name has to be a unique value.'),
    )
    .nullable();
}

export const EdgeSchema = Yup.array().of(
  Yup.object({
    target: Yup.object({
      port: Yup.string().required(),
      node: Yup.string(),
    }).required(),
    source: Yup.object({
      port: Yup.string().required(),
      node: Yup.string(),
    }).required(),
  }),
);

export const BrickSchema = Yup.object({
  type: Yup.string().oneOf(['brick']).required(),
  container: Yup.object().required(),
});

export const AnySchema = Yup.object({
  type: Yup.string().oneOf(['any']).required(),
});

export const GraphSchema = Yup.object({
  type: Yup.string().oneOf(['graph']).required(),
  inputMappings: EdgeSchema,
  outputMappings: EdgeSchema,
  edges: EdgeSchema,
  nodes: Yup.array().of(
    Yup.object({
      id: Yup.string().required().startsWithLetter(),
    }),
  ),
});
