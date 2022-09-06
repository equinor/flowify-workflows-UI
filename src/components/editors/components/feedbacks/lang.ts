export const FEEDBACK_MESSAGES = {
  UPDATE_ERROR: {
    type: 'error',
    componentMessage: 'Error when updating component. Changes were not saved.',
    workflowMessage: 'Error when updating workflow. Changes were not saved.',
  },
  SAVE_SUCCESS: {
    type: 'success',
    componentMessage: 'Component was successfully updated.',
    workflowMessage: 'Workflow was successfully updated.',
  },
  MARKETPLACE_SUCCESS: {
    type: 'success',
    componentMessage: 'Marketplace component was successfully added to component graph.',
    workflowMessage: 'Marketplace component was successfully added to workflow graph.',
  },
  MARKETPLACE_ERROR: {
    type: 'error',
    componentMessage: 'Error: Marketplace component could not be added to component graph.',
    workflowMessage: 'Error: Marketplace component could not be added to workflow graph.',
  },
};
