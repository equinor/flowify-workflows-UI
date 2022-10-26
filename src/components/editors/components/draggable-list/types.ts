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
  /**
   * Certian use-cases the cacheing and rendering that react and react-dnd is doing is actively working against us because we rerender the UI when the workflow or component object changes to maintain consistency. Using a nanoid in the key forces it to rerender properly with updated context, but for use-cases like formik, this won't work. So we give options to either use the index (formik) or nanoid (args, results, commands)
   */
  useIndex?: boolean;
}
