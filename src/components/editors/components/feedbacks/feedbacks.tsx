import React, { FC } from 'react';
import { Button, Snackbar } from '@equinor/eds-core-react';
import { FeedbacksProps, FeedbackTypes } from './types';
import { FEEDBACK_MESSAGES } from './lang';

const Feedbacks: FC<FeedbacksProps> = (props: FeedbacksProps) => {
  const { feedback, setFeedback } = props;
  if (!feedback) {
    return null;
  }
  return (
    <Snackbar open={feedback !== undefined} onClose={() => setFeedback(undefined)} placement="top">
      {FEEDBACK_MESSAGES[feedback]?.message}
      <Snackbar.Action>
        <Button onClick={() => setFeedback(undefined)} variant="ghost">
          Close
        </Button>
      </Snackbar.Action>
    </Snackbar>
  );
};

export { Feedbacks };
export type { FeedbackTypes };
