import * as Yup from 'yup';
import { Component } from '../../models/v2';
import { AnySchema, BrickSchema, DataSchema, GraphSchema } from './schemas';

export async function checkComponentValidation(component: Component | undefined, previous: Component | undefined) {
  const ComponentValidationSchema = Yup.object({
    name: Yup.string().required('Component name is required'),
    uid: Yup.string().required().oneOf([previous?.uid]),
    timestamp: Yup.string().required().oneOf([previous?.timestamp]),
    type: Yup.string().required().oneOf(['component'], 'Component type must be of type «component»'),
    implementation: Yup.lazy((value) => {
      if (value?.type === 'brick') {
        return BrickSchema;
      }
      if (value?.type === 'graph') {
        return GraphSchema;
      }
      if (value?.type === 'any') {
        return AnySchema;
      }
      return Yup.object({
        type: Yup.string().required().oneOf(['brick', 'any', 'graph']),
      }).required();
    }),
    inputs: DataSchema('component'),
    outputs: DataSchema('component'),
  });

  const errors = await ComponentValidationSchema.validate(component, { abortEarly: false }).catch((error) => {
    return error.inner.map((error: any) => {
      return { path: error.path, message: error.message, value: error.value, type: error.type, params: error.params };
    }, {});
  });
  console.log(errors);
  return errors;
}
