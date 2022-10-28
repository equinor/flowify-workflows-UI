import * as Yup from 'yup';
import { Workflow } from '../../models/v2';
import { AnySchema, BrickSchema, DataSchema, GraphSchema } from './schemas';

export async function checkWorkflowValidation(
  workflow: Workflow | undefined,
  previous: Workflow | undefined,
  secrets: string[],
  volumes: string[],
) {
  const WorkflowValidationSchema = Yup.object({
    name: Yup.string().required('Workflow name is required'),
    uid: Yup.string().required().oneOf([previous?.uid]),
    timestamp: Yup.string().required().oneOf([previous?.timestamp]),
    type: Yup.string().required().oneOf(['workflow'], 'Workflow type must be of type «workflow»'),
    component: Yup.object({
      type: Yup.string().required().oneOf(['component'], 'Workflow component type must be of type «component»'),
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
      inputs: DataSchema('workflow', secrets, volumes),
      outputs: DataSchema('workflow', secrets, volumes),
    }),
  });

  const errors = await WorkflowValidationSchema.validate(workflow, { abortEarly: false }).catch((error) => {
    return error.inner.map((error: any) => {
      return { path: error.path, message: error.message, value: error.value, type: error.type, params: error.params };
    }, {});
  });
  return errors;
}
