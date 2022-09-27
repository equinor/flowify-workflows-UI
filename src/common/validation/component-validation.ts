import * as Yup from 'yup';
import { Component } from '../../models/v2';
import { DATA_VALIDATION } from './schemas';

export async function checkComponentValidtion(component: Component | undefined, previous: Component | undefined) {
  const ComponentValidtionSchema = Yup.object({
    name: Yup.string().required(),
    uid: Yup.string().required().oneOf([previous?.uid]),
    timestamp: Yup.string().required().oneOf([previous?.timestamp]),
    type: Yup.string().required().oneOf(['component'], 'Component type must be of type «component»'),
    implementation: Yup.object({
      type: Yup.string().required().oneOf(['brick', 'graph', 'any']),
    }).required(),
    inputs: DATA_VALIDATION('component'),
    outputs: DATA_VALIDATION('component'),
  });

  const errors = await ComponentValidtionSchema.validate(component, { abortEarly: false }).catch((error) => {
    console.log(error.inner);
    return error.inner.map((error: any) => {
      return { path: error.path, message: error.message, value: error.value, type: error.type, params: error.params };
    }, {});
  });
  console.log(errors);
  return errors;
}
