import * as Yup from 'yup';

export function DataSchema(type: 'component' | 'workflow', secrets?: string[], volumes?: string[]) {
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
          value: Yup.lazy((value) => {
            if (Array.isArray(value)) {
              return Yup.array().of(Yup.string());
            }
            return Yup.string()
              .validSecret(type, secrets || [])
              .validVolume(type, volumes || []);
          }),
          description: Yup.string(),
        }),
      }).uniqueProperty('name', 'Input name is duplicate. Name has to be a unique value.'),
    )
    .nullable();
}

const PortSchema = Yup.object({
  port: Yup.string().required(),
  node: Yup.string(),
});

export const EdgeSchema = Yup.array().of(
  Yup.object({
    target: PortSchema.required(),
    source: PortSchema.required(),
  }),
);

export const BrickSchema = Yup.object({
  type: Yup.string().oneOf(['brick']).required(),
  container: Yup.object().required(),
  args: Yup.array().of(
    Yup.object({
      source: Yup.lazy((value) => (typeof value === 'string' ? Yup.string() : PortSchema)),
      target: Yup.object({
        type: Yup.string(),
        prefix: Yup.string(),
        suffix: Yup.string(),
      })
        .noUnknown(true)
        .strict(),
    }),
  ),
  results: Yup.array().of(
    Yup.object({
      source: Yup.mixed()
        .test(
          'validResult',
          'Result object needs to be a valid string or object with a `volume` or `file` field. Check out JSON Schema in Flowify docs for more information.',
          function (value) {
            if (typeof value === 'string') {
              return true;
            }
            if (value?.file) {
              return true;
            }
            if (value?.volume) {
              return value;
            }
            return false;
          },
        )
        .required(),
      target: PortSchema.required(),
    }),
  ),
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
      id: Yup.string().required(),
    }),
  ),
});
