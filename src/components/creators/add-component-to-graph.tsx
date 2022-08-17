import React, { FC, useState } from 'react';
import { Button, Tooltip, Icon, Progress } from '@equinor/eds-core-react';
import { Component } from '../../models/v2';

interface AddComponentToGraphProps {
  component: Component;
  onAddComponent: any;
}

type BUTTON_STATE = 'default' | 'loading' | 'success' | 'error';

export const AddComponentToGraph: FC<AddComponentToGraphProps> = (props: AddComponentToGraphProps) => {
  const { onAddComponent, component } = props;
  const [buttonState, setButtonState] = useState<BUTTON_STATE>('default');

  async function onAdd() {
    if (buttonState === 'loading') {
      return;
    }
    setButtonState('loading');
    onAddComponent(component, setButtonState);
  }

  function getButtonContent() {
    switch (buttonState) {
      case 'default':
        return <Icon name="add" />;
      case 'loading':
        return <Progress.Circular size={16} />;
      case 'success':
        return <Icon name="check" />;
      case 'error':
        return 'close';
      default:
        return <Icon name="add" />;
    }
  }

  return (
    <Tooltip title="Add component to workflow">
      <Button onClick={onAdd} variant="ghost_icon">
        {getButtonContent()}
      </Button>
    </Tooltip>
  );
};
