import { Workflow, WorkflowListRequest } from '../models/v2/workflow';
import { requests } from './requests';
import { createFiltersString, IFilter, IPagination } from './filters';

export class WorkflowService {
  public create(workflow: Workflow) {
    return requests
      .post(`api/v1/workflows/`)
      .send({ workflow })
      .then((res) => res.body as Workflow);
  }

  public list(filters?: IFilter[], pagination?: IPagination, sorting?: string) {
    const parsedFilters = createFiltersString(filters, pagination, sorting);
    return requests.get(`api/v1/workflows/${parsedFilters}`).then((res) => res.body as WorkflowListRequest);
  }

  public get(id: string, version?: string) {
    return requests.get(`api/v1/workflows/${id}${version ? `/${version}` : ''}`).then((res) => res.body as Workflow);
  }

  public update(workflow: Workflow, id: string) {
    return requests
      .patch(`api/v1/workflows/${id}`)
      .send({ workflow })
      .then((res) => res.body as Workflow);
  }

  public publish(workflow: Workflow, id: string) {
    return requests
      .put(`api/v1/workflows/${id}`)
      .send({ workflow })
      .then((res) => res.body as Workflow);
  }

  public delete(id: string, version: string | number) {
    return requests.delete(`api/v1/workflows/${id}/${version}`).then(() => null);
  }
}
