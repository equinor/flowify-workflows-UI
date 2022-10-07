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

export { getItemStyle, getListStyle };
