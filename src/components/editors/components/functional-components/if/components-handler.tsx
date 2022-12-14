import React, { FC, useState } from 'react';
import { Typography } from '@equinor/eds-core-react';
import { services } from '@services';
import { Component, Conditional } from '@models/v2';
import { Button, Stack } from '@ui';
import { MarketplaceModal } from '../..';

interface ComponentsHandlerProps {
  ifComponent: Component | undefined;
  setIfComponent: any;
  subcomponents: Component[] | undefined;
  setSubcomponents: any;
  setMarketplaceSnackbar?: any;
}

export const ComponentsHandler: FC<ComponentsHandlerProps> = (props: ComponentsHandlerProps) => {
  const { ifComponent, subcomponents, setSubcomponents, setIfComponent } = props;
  const [openMarketplace, setOpenMarketplace] = useState<'trueNode' | 'falseNode'>();
  const { nodeTrue, nodeFalse } = (ifComponent?.implementation as Conditional) || {};
  const trueNode = typeof nodeTrue === 'string' ? subcomponents?.find((comp) => comp.uid === nodeTrue) : nodeTrue;
  const falseNode = typeof nodeFalse === 'string' ? subcomponents?.find((comp) => comp.uid === nodeFalse) : nodeFalse;

  function addComponent(component: Component, setButtonState: any) {
    const { uid } = component;
    if (uid) {
      services.components
        .get(uid)
        .then((res) => setSubcomponents((prev: Component[]) => [...(prev || []), res]))
        .then(() => {
          setButtonState('success');
          //setMarketplaceSnackbar(true);
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        })
        .then(() => {
          if (openMarketplace === 'trueNode') {
            console.log('trueNode');
            console.log(uid);
            setIfComponent((prev: Component) => ({
              ...prev,
              implementation: {
                ...prev?.implementation,
                nodeTrue: uid,
              },
            }));
            setOpenMarketplace(undefined);
            return;
          }
          setIfComponent((prev: Component) => ({
            ...prev,
            implementation: {
              ...prev?.implementation,
              nodeFalse: uid,
            },
          }));
          setOpenMarketplace(undefined);
        });
    }
  }

  function removeNode(type: 'trueNode' | 'falseNode') {
    setIfComponent((prev: Component) => ({
      ...prev,
      implementation: {
        ...prev?.implementation,
        nodeTrue: type === 'trueNode' ? null : (prev?.implementation as Conditional)?.nodeTrue,
        nodeFalse: type === 'falseNode' ? null : (prev?.implementation as Conditional)?.nodeFalse,
      },
    }));
  }

  return (
    <>
      <Stack style={{ flexGrow: '1' }} spacing={1}>
        <Typography variant="h5">True component</Typography>
        {nodeTrue ? (
          <Stack spacing={2}>
            <Typography variant="body_short">{(trueNode as Component)?.name || 'Unnamed component'}</Typography>
            <Button theme="danger" onClick={() => removeNode('trueNode')}>
              Remove component
            </Button>
          </Stack>
        ) : (
          <Button onClick={() => setOpenMarketplace('trueNode')}>Add true component</Button>
        )}
      </Stack>
      <Stack style={{ flexGrow: '1' }} spacing={1}>
        <Typography variant="h5">False component</Typography>
        {nodeFalse ? (
          <Stack spacing={2}>
            <Typography variant="body_short">{(falseNode as Component)?.name || 'Unnamed component'}</Typography>
            <Button theme="danger" onClick={() => removeNode('falseNode')}>
              Remove component
            </Button>
          </Stack>
        ) : (
          <Button onClick={() => setOpenMarketplace('falseNode')}>Add false component</Button>
        )}
      </Stack>
      <MarketplaceModal
        open={openMarketplace !== undefined}
        onClose={() => setOpenMarketplace(undefined)}
        onAddComponent={addComponent}
        component={undefined}
        setComponent={() => null}
        subcomponents={subcomponents}
      />
    </>
  );
};
