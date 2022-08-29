const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const removeItem = (list: any[], index: number) => {
  list.splice(index, 1);
  return list;
};

export { reorder, removeItem };
