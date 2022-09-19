export interface Feedback {
  message: string;
  type: 'error' | 'success';
}

export interface FeedbacksProps {
  feedback: Feedback | undefined;
  setFeedback: any;
}
