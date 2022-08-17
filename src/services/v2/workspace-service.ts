import { WorkspaceList } from '../../models/v2';
import { requests } from '../requests';

export class WorkspaceService {
  public list() {
    return requests.get('api/v2/workspaces/').then((res) => res.body as WorkspaceList);
  }
}
