import { UserInfo } from '../../models/v2/userinfo';
import { requests } from '../requests';

export class UserInfoService {
  public getUserInfo() {
    return requests.get('api/v2/userinfo/').then((res) => res.body as UserInfo);
  }
}
