import { FeedbackLang } from './types';

export const FEEDBACK_MESSAGES: FeedbackLang = {
  UPDATE_WF_ERROR: {
    type: 'error',
    message: 'Error when updating workflow. Changes were not saved.',
  },
  UPDATE_COMP_ERROR: {
    type: 'error',
    message: 'Error when updating component. Changes were not saved.',
  },
  UPDATE_WF_SUCCESS: {
    type: 'success',
    message: 'Workflow was successfully updated.',
  },
  UPDATE_COMP_SUCCESS: {
    type: 'success',
    message: 'Component was successfully updated.',
  },
  ADD_COMP_TO_WF_SUCCESS: {
    type: 'success',
    message: 'Marketplace component was successfully added to workflow graph.',
  },
  ADD_COMP_TO_COMP_SUCCESS: {
    type: 'success',
    message: 'Marketplace component was successfully added to component graph.',
  },
  ADD_COMP_TO_WF_ERROR: {
    type: 'error',
    message: 'Error: Marketplace component could not be added to workflow graph.',
  },
  ADD_COMP_TO_COMP_ERROR: {
    type: 'error',
    message: 'Error: Marketplace component could not be added to component graph.',
  },
  PUBLISH_COMP_ERROR: {
    type: 'error',
    message: 'Error: Could not create new component version',
  },
  PUBLISH_WF_ERROR: {
    type: 'error',
    message: 'Error: could not create new workflow version',
  },
  DELETE_COMP_ERROR: {
    type: 'error',
    message: 'Error when deleting component.',
  },
  DELETE_WF_ERROR: {
    type: 'error',
    message: 'Error when deleting workflow.',
  },
  SECRET_SUCCESS: {
    type: 'error',
    message: 'Secret was successfully added',
  },
} as const;
