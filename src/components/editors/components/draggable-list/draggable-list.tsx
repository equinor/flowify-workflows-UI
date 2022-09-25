import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { removeItem, reorder } from './helpers';
import { nanoid } from '../../helpers';
import { Button } from '../../../ui';

interface DraggableListProps {
  list: any[] | undefined | null;
  type: string;
  label: string;
  addItem: () => void;
  child?: (item: any, index: number) => React.ReactNode;
  onChange: (list: any[]) => void;
  name?: string;
  customDragEnd?: (indexA: number, indexB: number) => void;
  customRemove?: (index: number) => void;
}

export const DraggableList: FC<DraggableListProps> = (props: DraggableListProps) => {
  const { list, type, child, onChange, name, customDragEnd, customRemove } = props;

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '1rem',
    borderRadius: '10px',
    userSelect: 'none',
    padding: '0.5rem 1rem',
    background: isDragging ? 'rgba(255, 255, 255, 0.8)' : 'white',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as 'column',
    background: isDraggingOver ? '#E6FAEC' : 'white',
    border: isDraggingOver ? '2px dashed #4BB748' : 'none',
  });

  function onDragEnd(result: any) {
    const { source, destination } = result;
    if (typeof customDragEnd === 'function') {
      customDragEnd(source.index, destination.index);
      return;
    }
    if (destination.droppableId === `container-${type}`) {
      const updatedList = reorder(list!, source.index, destination.index);
      onChange(updatedList);
      return;
    }
  }

  function onRemove(index: number) {
    if (typeof customRemove === 'function') {
      customRemove(index);
      return;
    }
    const updatedList = removeItem(list!, index);
    onChange(updatedList);
  }

  return (
    <div>
      <Typography variant="body_short_bold">{props.label}</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`container-${type}`}>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {list?.map((item, index) => (
                <Draggable
                  key={`draggable_item_${name || nanoid(4)}_${index}`}
                  draggableId={`draggable_item_${type}_${index}`}
                  index={index}
                >
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, prov.draggableProps.style)}
                    >
                      <Icon name="drag_handle" />
                      {typeof child === 'function' ? child(item, index) : null}
                      <Button theme="simple" onClick={() => onRemove(index)}>
                        <Icon name="clear" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Stack alignItems="flex-end">
          <Button theme="simple" onClick={props.addItem}>
            <Icon name="add" /> Add {type}
          </Button>
        </Stack>
      </DragDropContext>
    </div>
  );
};
