const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '1rem',
  borderRadius: '10px',
  userSelect: 'none',
  padding: '0.5rem 1rem',
  background: isDragging ? 'rgba(255, 255, 255, 0.4)' : 'none',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  display: 'flex',
  flexDirection: 'column' as 'column',
  background: isDraggingOver ? 'rgba(161, 218, 160, 0.1)' : 'none',
  border: isDraggingOver ? '2px dashed #4BB748' : 'none',
});

export { getItemStyle, getListStyle };
