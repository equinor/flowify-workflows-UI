import { ISecret, ISecretsList } from '../../models/v2';
import { requests } from '../requests';

export class SecretService {
  public list(workspace: string) {
    return requests.get(`api/v1/secrets/${workspace}/`).then((res) => res.body as ISecretsList);
  }

  public create(secret: ISecret, workspace: string) {
    return requests
      .put(`api/v1/secrets/${workspace}/${secret.key}`)
      .send({ ...secret })
      .then((res) => res.body as ISecret);
  }

  public delete(secretKey: string, workspace: string) {
    return requests.delete(`api/v1/secrets/${workspace}/${secretKey}`).then((res) => res.body);
  }
}
