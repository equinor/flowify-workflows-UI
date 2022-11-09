import React, { FC } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Stack } from '@ui';
import { nanoid } from '@common';
import { removeItem, reorder } from './helpers';
import { getItemStyle, getListStyle } from './styles';
import { DraggableListProps } from './types';

/**
 * DraggableList. Takes a list of items (object or string) and maps the item to draggable items. Inside the draggable the function you passed to the child prop will be called with the item from the map and the index as parameters. It will then print whatever you return in this function as a child of the draggable.
 * @returns React.ReactNode
 */
export const DraggableList: FC<DraggableListProps> = (props: DraggableListProps) => {
  const { list, child, onChange, customDragEnd, customRemove, addButtonLabel, id } = props;

  function onDragEnd(result: any) {
    const { source, destination } = result;
    if (typeof customDragEnd === 'function') {
      customDragEnd(source.index, destination.index);
      return;
    }
    if (destination.droppableId === `container-${id}`) {
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
        <Droppable droppableId={`container-${id}`}>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {list?.map((item, index) => (
                <Draggable
                  key={`draggable_item_${id}_${props.useIndex ? index : nanoid(4)}`}
                  draggableId={`draggable_item_${id}_${index}`}
                  index={index}
                >
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, prov.draggableProps.style)}
                    >
                      <Icon name="drag_handle" style={{ flexShrink: 0 }} />
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
        <Stack alignItems="flex-end" style={{ paddingTop: '1rem' }}>
          <Button theme="simple" onClick={props.addItem}>
            <Icon name="add" /> {addButtonLabel}
          </Button>
        </Stack>
      </DragDropContext>
    </div>
  );
};

DraggableList.defaultProps = {
  addButtonLabel: 'Add item',
  useIndex: false,
};
