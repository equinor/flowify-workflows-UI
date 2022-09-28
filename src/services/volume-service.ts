import { IVolume, IVolumesRequest, IUserVolume } from '../models/v2/volume';
import { requests } from './requests';

export class VolumeService {
  public list(workspace: string) {
    return requests.get(`api/v1/volumes/${workspace}/`).then((res) => res.body as IVolumesRequest);
  }

  public create(workspace: string, volume: IUserVolume) {
    return requests
      .post(`api/v1/volumes/${workspace}/`)
      .send({ ...volume })
      .then((res) => res.body);
  }

  public get(workspace: string, uid: string) {
    return requests.get(`api/v1/volumes/${workspace}/${uid}`).then((res) => res.body as IVolume);
  }
  public update(workspace: string, volume: IVolume) {
    const { uid } = volume;
    return requests
      .put(`api/v1/volumes/${workspace}/${uid}`)
      .send({ ...volume })
      .then((res) => res.body);
  }
  public delete(workspace: string, uid: string) {
    return requests.delete(`api/v1/volumes/${workspace}/${uid}`).then((res) => res.body);
  }
}
