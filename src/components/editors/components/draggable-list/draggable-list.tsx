import React, { FC, useState } from 'react';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { Stack } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { removeItem, reorder } from './helpers';
import { nanoid } from '../../helpers';

interface DraggableListProps {
  list: any[] | undefined | null;
  type: string;
  label: string;
  addItem: () => void;
  child?: (item: any, index: number) => React.ReactNode;
  onChange: (list: any[]) => void;
}

export const DraggableList: FC<DraggableListProps> = (props: DraggableListProps) => {
  const { list, type, child, onChange } = props;
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  const getDeleteBoxStyle = (isDraggingOver: boolean) => ({
    display: 'flex',
    padding: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #FFAEBF',
    background: isDraggingOver ? '#FFE0E7' : 'white',
  });

  function onDragEnd(result: any) {
    setIsDragging(false);
    const { source, destination } = result;
    if (destination.droppableId === `container-${type}`) {
      const updatedList = reorder(list!, source.index, destination.index);
      onChange(updatedList);
      return;
    }
    if (destination.droppableId === `trash-${type}`) {
      const updatedList = removeItem(list!, source.index);
      onChange(updatedList);
    }
  }

  return (
    <div>
      <Typography variant="h6">{props.label}</Typography>
      <DragDropContext onBeforeCapture={() => setIsDragging(true)} onDragEnd={onDragEnd}>
        <Droppable droppableId={`container-${type}`}>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {list?.map((item, index) => (
                <Draggable
                  key={`draggable_item_${nanoid(4)}_${index}`}
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {isDragging && (
          <Droppable droppableId={`trash-${type}`}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getDeleteBoxStyle(snapshot.isDraggingOver)}
              >
                <Icon name="delete_to_trash" color="#EB0037" size={32} />
              </div>
            )}
          </Droppable>
        )}
        <Stack alignItems="flex-end">
          <Button variant="ghost" onClick={props.addItem}>
            <Icon name="add" /> Add {type}
          </Button>
        </Stack>
      </DragDropContext>
    </div>
  );
};
