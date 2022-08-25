import React, { FC, useState } from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import { Dialog, Stack } from '@mui/material';
import { services } from '../../../../../services/v2';
import { Component, Conditional } from '../../../../../models/v2';
import { MarketplaceModal } from '../../marketplace-modal';

interface ComponentsHandlerProps {
  ifComponent: Component | undefined;
  setIfComponent: any;
  subcomponents: Component[] | undefined;
  setSubcomponents: any;
  setMarketplaceSnackbar: any;
}

export const ComponentsHandler: FC<ComponentsHandlerProps> = (props: ComponentsHandlerProps) => {
  const { ifComponent, subcomponents, setSubcomponents, setMarketplaceSnackbar, setIfComponent } = props;
  const [openMarketplace, setOpenMarketplace] = useState<'trueNode' | 'falseNode'>();
  const [selectComponent, setSelectComponent] = useState<'trueNode' | 'falseNode'>();
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
          setMarketplaceSnackbar(true);
          setTimeout(() => {
            setButtonState('default');
          }, 3000);
        })
        .then(() => {
          if (openMarketplace === 'trueNode') {
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
      <Dialog open={selectComponent !== undefined}></Dialog>
      <Stack sx={{ flexGrow: '1' }} spacing={2}>
        <Typography variant="h5">True component</Typography>
        {nodeTrue ? (
          <Stack spacing={2}>
            <Typography variant="body_short">{(trueNode as Component)?.name || 'Unnamed component'}</Typography>
            <Button variant="ghost" onClick={() => removeNode('trueNode')}>
              Remove component
            </Button>
          </Stack>
        ) : (
          <Button onClick={() => setOpenMarketplace('trueNode')}>Add true component</Button>
        )}
      </Stack>
      <Stack sx={{ flexGrow: '1' }} spacing={2}>
        <Typography variant="h5">False component</Typography>
        {nodeFalse ? (
          <Stack spacing={2}>
            <Typography variant="body_short">{(falseNode as Component)?.name || 'Unnamed component'}</Typography>
            <Button variant="ghost" onClick={() => removeNode('falseNode')}>
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
      />
    </>
  );
};
