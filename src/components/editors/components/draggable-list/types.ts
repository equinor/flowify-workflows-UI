import React from 'react';

export interface DraggableListProps {
  // List of items to map to draggable items. The values of the list, whether they are objects or string, will be returned to you as a parameter in whatever function you pass to the child prop.
  list: any[] | undefined | null;
  id: string;
  addButtonLabel?: string;
  label: string;
  addItem: () => void;
  child?: (item: any, index: number) => React.ReactNode;
  // onChange will return full updated list with new order or items removed or added.
  onChange: (list: any[]) => void;
  // Pass customDragEnd function to handle drag end functionality instead of component calling onChange props with updated list.
  customDragEnd?: (indexA: number, indexB: number) => void;
  // Pass customRemove function to handle drag end functionality instead of component calling onChange props with updated list.
  customRemove?: (index: number) => void;
}
