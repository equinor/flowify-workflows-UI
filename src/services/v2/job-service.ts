import { IJobsListRequest, Job, JobSubmit } from '../../models/v2';
import { requests } from '../requests';
import { Observable, map, filter } from 'rxjs';
import { kubernetes } from '../../models';
import { WorkflowJob } from '../../models/workflow-jobs';
import { IFilter, createFiltersString, IPagination } from './filters';

export class JobService {
  public list(filters?: IFilter[], pagination?: IPagination, sorting?: string) {
    const parsedFilters = filters ? createFiltersString(filters, pagination, sorting) : '';
    return requests.get(`api/v2/jobs/${parsedFilters}`).then((res) => res.body as IJobsListRequest);
  }

  public get(id: string) {
    return requests.get(`api/v2/jobs/${id}`).then((res) => res.body as Job);
  }

  public submit(job: JobSubmit) {
    return requests
      .post(`api/v2/jobs/`)
      .send({ job })
      .then((res) => res.headers.location);
  }

  public watch(id: string): Observable<kubernetes.WatchEvent<WorkflowJob>> {
    const url = `api/v2/jobs/${id}/events/`;
    return requests.loadEventSource(url).pipe(
      filter((d) => d !== null),
      map((data) => JSON.parse(data) as kubernetes.WatchEvent<WorkflowJob>),
    );
  }
}
