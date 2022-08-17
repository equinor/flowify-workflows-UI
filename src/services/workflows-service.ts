import { Observable, map, filter, from, of, switchMap, mergeMap } from 'rxjs';
import {
  kubernetes,
  Workflow,
  WorkflowList,
  WorkflowPhase,
  SubmitOpts,
  Parameter,
  LogEntry,
  NodeStatus,
  NODE_PHASE,
  Annotation,
} from '../models';
import { Pagination } from './pagination';
import { requests } from './requests';

export class WorkflowsService {
  public create(workflow: Workflow, namespace: string) {
    return requests
      .post(`api/v1/workflows/${namespace}`)
      .send({ workflow })
      .then((res) => res.body as Workflow);
  }

  public list(
    namespace: string,
    phases: WorkflowPhase[],
    labels: string[],
    pagination: Pagination,
    fields = [
      'metadata',
      'items.metadata.uid',
      'items.metadata.name',
      'items.metadata.namespace',
      'items.metadata.creationTimestamp',
      'items.metadata.labels',
      'items.status.phase',
      'items.status.message',
      'items.status.finishedAt',
      'items.status.startedAt',
      'items.status.estimatedDuration',
      'items.status.progress',
      'items.spec.suspend',
    ],
  ) {
    const params = this.queryParams({ phases, labels });
    if (pagination) {
      if (pagination.offset) {
        params.push(`listOptions.continue=${pagination.offset}`);
      }
      if (pagination.limit) {
        params.push(`listOptions.limit=${pagination.limit}`);
      }
    }
    params.push(`fields=${fields.join(',')}`);
    return requests.get(`api/v1/workflows/${namespace}?${params.join('&')}`).then((res) => res.body as WorkflowList);
  }

  public get = (namespace: string, name: string) =>
    requests.get(`api/v1/workflows/${namespace}/${name}`).then((res) => res.body as Workflow);

  public submit(kind: string, name: string, namespace: string, submitOptions?: SubmitOpts, version?: string) {
    const textOpts = submitOptions
      ? {
          parameters: submitOptions.parameters?.map((p: Parameter) => `${p.name}=${p.value}`),
          labels: submitOptions.labels?.join(','),
          annotations: submitOptions.annotations?.map((a: Annotation) => `${a.name}=${a.value}`).join(','),
          entryPoint: submitOptions.entryPoint,
        }
      : undefined;
    return requests
      .post(`api/v1/workflows/${namespace}/submit`)
      .send({ namespace, resourceKind: kind, resourceName: name, submitOptions: textOpts, version: version })
      .then((res) => res.body as Workflow);
  }

  public watch(filterParam: {
    namespace?: string;
    name?: string;
    phases?: Array<WorkflowPhase>;
    labels?: Array<string>;
    resourceVersion?: string;
  }): Observable<kubernetes.WatchEvent<Workflow>> {
    const url = `api/v1/workflow-events/${filterParam.namespace || ''}?${this.queryParams(filterParam).join('&')}`;
    return requests.loadEventSource(url).pipe(
      filter((d) => d !== null),
      map((data) => JSON.parse(data).result as kubernetes.WatchEvent<Workflow>),
    );
  }

  // public watchEvents(namespace: string, fieldSelector: string): Observable<Event> {
  //     return requests.loadEventSource(`api/v1/stream/events/${namespace}?listOptions.fieldSelector=${fieldSelector}`).map(data => data && (JSON.parse(data).result as Event));
  // }

  public watchFields(filterParam: {
    namespace?: string;
    name?: string;
    phases?: Array<WorkflowPhase>;
    labels?: Array<string>;
    resourceVersion?: string;
  }): Observable<kubernetes.WatchEvent<Workflow>> {
    const params = this.queryParams(filterParam);
    const fields = [
      'result.object.metadata.name',
      'result.object.metadata.namespace',
      'result.object.metadata.resourceVersion',
      'result.object.metadata.creationTimestamp',
      'result.object.metadata.uid',
      'result.object.status.finishedAt',
      'result.object.status.phase',
      'result.object.status.message',
      'result.object.status.startedAt',
      'result.object.status.estimatedDuration',
      'result.object.status.progress',
      'result.type',
      'result.object.metadata.labels',
      'result.object.metadata.annotations',
      'result.object.spec.suspend',
    ];
    params.push(`fields=${fields.join(',')}`);
    const url = `api/v1/workflow-events/${filterParam.namespace || ''}?${params.join('&')}`;
    return requests.loadEventSource(url).pipe(
      filter((d) => d !== null),
      map((data) => JSON.parse(data).result as kubernetes.WatchEvent<Workflow>),
    );
    // .pipe data => data && (JSON.parse(data).result as kubernetes.WatchEvent<Workflow>) //.map(data => data && (JSON.parse(data).result as kubernetes.WatchEvent<Workflow>));
  }

  public resubmit(name: string, namespace: string) {
    return requests.put(`api/v1/workflows/${namespace}/${name}/resubmit`).then((res) => res.body as Workflow);
  }

  public getContainerLogsFromCluster(
    workflow: Workflow,
    podName: string,
    container: string,
    grep: string,
  ): Observable<LogEntry> {
    const namespace = workflow.metadata.namespace;
    const name = workflow.metadata.name;
    const podLogsURL = `api/v1/workflows/${namespace}/${name}/log?logOptions.container=${container}&grep=${grep}&logOptions.follow=true${
      podName ? `&podName=${podName}` : ''
    }`;
    return requests.loadEventSource(podLogsURL).pipe(
      filter((line) => !!line),
      map((line) => JSON.parse(line).result as LogEntry),
      //.filter(e => isString(e.content))
    );
    // .catch(() => {
    //     // When an error occurs on an observable, RxJS is hard-coded to unsubscribe from the stream.  In the case
    //     // that the connection to the server was interrupted while the node is still pending or running, this is not
    //     // correct since we actually want the EventSource to re-connect and continue streaming logs.  In the event
    //     // that the pod has completed, then we want to allow the unsubscribe to happen since no additional logs exist.
    //     return Observable.fromPromise(this.isWorkflowNodePendingOrRunning(workflow, podName)).switchMap(isPendingOrRunning => {
    //         if (isPendingOrRunning) {
    //             return this.getContainerLogsFromCluster(workflow, podName, container, grep);
    //         }

    //         // If our workflow is completed, then simply complete the Observable since nothing else
    //         // should be omitted
    //         return Observable.empty();
    //     });
    // });
  }

  // the following code is heavily inspired by argo :)
  private queryParams(filter: {
    namespace?: string;
    name?: string;
    phases?: Array<WorkflowPhase>;
    labels?: Array<string>;
    resourceVersion?: string;
  }) {
    const queryParams: string[] = [];
    if (filter.name) {
      queryParams.push(`listOptions.fieldSelector=metadata.name=${filter.name}`);
    }
    const labelSelector = this.labelSelectorParams(filter.phases, filter.labels);
    if (labelSelector.length > 0) {
      queryParams.push(`listOptions.labelSelector=${labelSelector}`);
    }
    if (filter.resourceVersion) {
      queryParams.push(`listOptions.resourceVersion=${filter.resourceVersion}`);
    }
    return queryParams;
  }

  private labelSelectorParams(phases?: Array<WorkflowPhase>, labels?: Array<string>) {
    let labelSelector = '';
    if (phases && phases.length > 0) {
      labelSelector = `workflows.argoproj.io/phase in (${phases.join(',')})`;
    }
    if (labels && labels.length > 0) {
      if (labelSelector.length > 0) {
        labelSelector += ',';
      }
      labelSelector += labels.join(',');
    }
    return labelSelector;
  }

  public async isWorkflowNodePendingOrRunning(workflow: Workflow, nodeId?: string) {
    // We always refresh the workflow rather than inspecting the state locally since it doubles
    // as a check to determine whether or not the API is currently reachable
    const updatedWorkflow = await this.get(workflow.metadata.namespace!, workflow.metadata.name!);
    const node = updatedWorkflow?.status?.nodes[nodeId!];
    if (!node) {
      return !updatedWorkflow.status || ['Pending', 'Running'].includes(updatedWorkflow.status.phase);
    }
    return this.isNodePendingOrRunning(node);
  }

  public getContainerLogsFromArtifact(
    workflow: Workflow,
    nodeId: string,
    container: string,
    grep: string,
    archived: boolean,
  ) {
    // return Observable.of(this.hasArtifactLogs(workflow, nodeId, container))
    return of(this.hasArtifactLogs(workflow, nodeId, container))
      .pipe(
        switchMap((hasArtifactLogs: any) => {
          if (!hasArtifactLogs) {
            throw new Error('no artifact logs are available');
          }

          return from(requests.get(this.getArtifactLogsUrl(workflow, nodeId, container, archived)));
          // return Observable.fromPromise(requests.get(this.getArtifactLogsUrl(workflow, nodeId, container, archived)));
        }),
      )
      .pipe(
        mergeMap((r: { text: string }) => r.text.split('\n')),
        map((content: any) => ({ content } as LogEntry)),
        filter((x: { content: string }) => !!x.content.match(grep)),
      );
  }

  public getContainerLogs(
    workflow: Workflow,
    podName: string,
    nodeId: string,
    container: string,
    grep: string,
    archived: boolean,
  ): Observable<LogEntry> {
    const getLogsFromArtifact = () => this.getContainerLogsFromArtifact(workflow, nodeId, container, grep, archived);

    // If our workflow is archived, don't even bother inspecting the cluster for logs since it's likely
    // that the Workflow and associated pods have been deleted
    if (archived) {
      return getLogsFromArtifact();
    }
    // return archived log if main container is finished and has artifact
    // return Observable.fromPromise(this.isWorkflowNodePendingOrRunning(workflow, nodeId)).switchMap((isPendingOrRunning: any) => {
    return from(this.isWorkflowNodePendingOrRunning(workflow, nodeId)).pipe(
      switchMap((isPendingOrRunning: any) => {
        if (!isPendingOrRunning && this.hasArtifactLogs(workflow, nodeId, container) && container === 'main') {
          return getLogsFromArtifact();
        }
        return this.getContainerLogsFromCluster(workflow, podName, container, grep); //.catch(getLogsFromArtifact);
      }),
    );
  }

  public getArtifactLogsUrl(workflow: Workflow, nodeId: string, container: string, archived: boolean) {
    return this.getArtifactDownloadUrl(workflow, nodeId, container + '-logs', archived, false);
  }

  public getArtifactDownloadUrl(
    workflow: Workflow,
    nodeId: string,
    artifactName: string,
    archived: boolean,
    isInput: boolean,
  ) {
    if (archived) {
      const endpoint = isInput ? 'input-artifacts-by-uid' : 'artifacts-by-uid';
      return `${endpoint}/${workflow.metadata.uid}/${nodeId}/${encodeURIComponent(artifactName)}`;
    } else {
      const endpoint = isInput ? 'input-artifacts' : 'artifacts';
      return `${endpoint}/${workflow.metadata.namespace}/${workflow.metadata.name}/${nodeId}/${encodeURIComponent(
        artifactName,
      )}`;
    }
  }

  private isNodePendingOrRunning(node: NodeStatus) {
    return node.phase === NODE_PHASE.PENDING || node.phase === NODE_PHASE.RUNNING;
  }

  private hasArtifactLogs(workflow: Workflow, nodeId: string, container: string) {
    const node = workflow.status?.nodes[nodeId];

    if (!node || !node.outputs || !node.outputs.artifacts) {
      return false;
    }

    return node.outputs.artifacts.findIndex((a) => a.name === `${container}-logs`) !== -1;
  }
}
