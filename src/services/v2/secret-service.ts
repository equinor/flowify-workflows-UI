import { ISecret, ISecretsList } from '../../models/v2';
import { requests } from '../requests';

export class SecretService {
  public list(workspace: string) {
    return requests.get(`api/v2/secrets/${workspace}/`).then((res) => res.body as ISecretsList);
  }

  public create(secret: ISecret, workspace: string) {
    return requests
      .put(`api/v2/secrets/${workspace}/${secret.key}`)
      .send({ ...secret })
      .then((res) => res.body as ISecret);
  }

  public delete(secret: ISecret, workspace: string) {
    const { key } = secret;
    return requests.delete(`api/v2/secrets/${workspace}/${key}`).then((res) => res.body);
  }
}
