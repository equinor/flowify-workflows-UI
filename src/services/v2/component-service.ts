import { Component, ComponentListRequest } from '../../models/v2';
import { requests } from '../requests';
import { createFiltersString, IFilter, IPagination } from './filters';

export class ComponentService {
  public create(component: Component) {
    return requests
      .post(`api/v2/components/`)
      .send({ component })
      .then((res) => res.body as Component);
  }

  public list(filters?: IFilter[], pagination?: IPagination, sorting?: string) {
    const parsedFilters = filters ? createFiltersString(filters, pagination, sorting) : '';
    return requests.get(`api/v2/components/${parsedFilters}`).then((res) => res.body as ComponentListRequest);
  }

  public get(id: string, version?: string) {
    let uri = `api/v2/components/${id}${version ? `/${version}` : ''}`;
    return requests.get(uri).then((res) => res.body as Component);
  }

  public update(component: Component, id: string) {
    return requests
      .put(`api/v2/components/${id}`)
      .send({ component })
      .then((res) => res.body as Component);
  }
}
