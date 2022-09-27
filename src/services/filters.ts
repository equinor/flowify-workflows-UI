export interface IFilter {
  name: string;
  value: string;
  type: 'EQUALTO' | 'LESSTHAN' | 'MORETHAN' | 'SEARCH';
}

export interface IPagination {
  limit?: number;
  offset?: number;
}

const TYPES = {
  EQUALTO: '[==]',
  LESSTHAN: '[<]',
  MORETHAN: '[>]',
  SEARCH: '[search]',
};

export function createFiltersString(filters?: IFilter[], pagination?: IPagination, sorting?: string) {
  if (!filters && !pagination && !sorting) {
    return '';
  }
  const array = [];
  if (filters) {
    filters.forEach((filter) => array.push(`filter=${filter.name}${TYPES[filter.type]}=${filter.value}`));
  }
  if (pagination) {
    const { limit, offset } = pagination;
    if (limit && limit !== 10) {
      array.push(`limit=${limit}`);
    }
    if (offset && offset !== 0) {
      array.push(`offset=${offset}`);
    }
  }
  if (sorting) {
    array.push(sorting);
  }
  return `?${array.join('&')}`;
}
