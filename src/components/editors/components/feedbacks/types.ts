export type FeedbackTypes =
  | 'UPDATE_WF_ERROR'
  | 'UPDATE_COMP_ERROR'
  | 'UPDATE_WF_SUCCESS'
  | 'UPDATE_COMP_SUCCESS'
  | 'ADD_COMP_TO_WF_SUCCESS'
  | 'ADD_COMP_TO_COMP_SUCCESS'
  | 'ADD_COMP_TO_WF_ERROR'
  | 'ADD_COMP_TO_COMP_ERROR'
  | 'PUBLISH_COMP_ERROR'
  | 'PUBLISH_WF_ERROR'
  | 'DELETE_COMP_ERROR'
  | 'DELETE_WF_ERROR'
  | 'SECRET_SUCCESS';

export interface FeedbackLang {
  [name: string]: {
    type: 'error' | 'success';
    message: string;
  };
}

export interface FeedbacksProps {
  feedback: FeedbackTypes | undefined;
  setFeedback: any;
}
