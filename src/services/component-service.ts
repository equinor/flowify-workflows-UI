import { Component, ComponentListRequest } from '../models/v2';
import { requests } from './requests';
import { createFiltersString, IFilter, IPagination } from './filters';

export class ComponentService {
  public create(component: Component) {
    return requests
      .post(`api/v1/components/`)
      .send({ component })
      .then((res) => res.body as Component);
  }

  public list(filters?: IFilter[], pagination?: IPagination, sorting?: string) {
    const parsedFilters = filters ? createFiltersString(filters, pagination, sorting) : '';
    return requests.get(`api/v1/components/${parsedFilters}`).then((res) => res.body as ComponentListRequest);
  }

  public get(id: string, version?: string | number) {
    let uri = `api/v1/components/${id}${version ? `/${version}` : ''}`;
    return requests.get(uri).then((res) => res.body as Component);
  }

  public publish(component: Component, id: string) {
    return requests
      .put(`api/v1/components/${id}`)
      .send({ component })
      .then(
        (res) => res.body as Component,
        (reason) => reason,
      );
  }

  public update(component: Component, id: string) {
    return requests
      .patch(`api/v1/components/${id}`)
      .send({ component })
      .then(
        (res) => res.body as Component,
        (reason) => reason,
      );
  }

  public delete(id: string, version: string | number) {
    return requests.delete(`api/v1/components/${id}/${version}`).then(
      () => null,
      (reason) => reason,
    );
  }
}
