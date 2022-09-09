export type FeedbackTypes =
  | 'UPDATE_ERROR'
  | 'SAVE_SUCCESS'
  | 'MARKETPLACE_SUCCESS'
  | 'MARKETPLACE_ERROR'
  | 'PUBLISH_ERROR';

export interface FeedbacksProps {
  feedback: FeedbackTypes | undefined;
  setFeedback: any;
  type: 'component' | 'workflow';
}
