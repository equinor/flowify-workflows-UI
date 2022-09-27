import * as Yup from 'yup';
import { Workflow } from '../../models/v2';
import { DATA_VALIDATION } from './schemas';

export async function checkWorkflowValidtion(
  workflow: Workflow | undefined,
  previous: Workflow | undefined,
  secrets: string[],
) {
  const ComponentValidtionSchema = Yup.object({
    name: Yup.string().required(),
    uid: Yup.string().required().oneOf([previous?.uid]),
    timestamp: Yup.string().required().oneOf([previous?.timestamp]),
    type: Yup.string().required().oneOf(['workflow'], 'Workflow type must be of type «workflow»'),
    component: Yup.object({
      type: Yup.string().required().oneOf(['component'], 'Workflow component type must be of type «component»'),
      implementation: Yup.object({
        type: Yup.string().required().oneOf(['brick', 'graph', 'any']),
      }).required(),
      inputs: DATA_VALIDATION('workflow', secrets),
      outputs: DATA_VALIDATION('workflow', secrets),
    }),
  });

  const errors = await ComponentValidtionSchema.validate(workflow, { abortEarly: false }).catch((error) => {
    console.log(error.inner);
    return error.inner.map((error: any) => {
      return { path: error.path, message: error.message, value: error.value, type: error.type, params: error.params };
    }, {});
  });
  console.log(errors);
  return errors;
}
