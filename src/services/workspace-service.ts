import { Workspace, WorkspaceList } from '../models/v2';
import { requests } from './requests';

export class WorkspaceService {
  public create(workspace: Workspace) {
    return requests
      .post(`api/v1/workspaces/`)
      .send(workspace)
      .then((res) => res.body as Workspace);
  }

  public update(workspace: Workspace) {
    return requests
      .put(`api/v1/workspaces/`)
      .send(workspace)
      .then((res) => res.body as Workspace);
  }

  public delete(workspace: Workspace) {
    return requests
      .delete(`api/v1/workspaces/`)
      .send(workspace)
      .then((res) => res.body as Workspace);
  }

  public list() {
    return requests.get('api/v1/workspaces/').then((res) => res.body as WorkspaceList);
  }
}
