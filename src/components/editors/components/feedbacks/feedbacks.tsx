import React, { FC } from 'react';
import { Button, Snackbar } from '@equinor/eds-core-react';

export type FeedbackTypes = 'UPDATE_ERROR' | 'SAVE_SUCCESS' | 'MARKETPLACE_SUCCESS' | 'MARKETPLACE_ERROR';

interface FeedbacksProps {
  feedback: FeedbackTypes | undefined;
  setFeedback: any;
  type: 'component' | 'workflow';
}

const FEEDBACK_MESSAGES = {
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

export const Feedbacks: FC<FeedbacksProps> = (props: FeedbacksProps) => {
  const { feedback, setFeedback, type } = props;
  if (!feedback) {
    return null;
  }
  return (
    <Snackbar open={feedback !== undefined} onClose={() => setFeedback(undefined)} placement="top">
      {type === 'component'
        ? FEEDBACK_MESSAGES[feedback]?.componentMessage
        : FEEDBACK_MESSAGES[feedback]?.workflowMessage}
      <Snackbar.Action>
        <Button onClick={() => setFeedback(undefined)} variant="ghost">
          Close
        </Button>
      </Snackbar.Action>
    </Snackbar>
  );
};
