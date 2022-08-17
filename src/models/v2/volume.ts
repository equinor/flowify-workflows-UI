import { Volume } from '../kubernetes';
import { IPageInfo } from './requests';

export interface IVolume {
  uid: string;
  workspace: string;
  volume: Volume;
}

export interface IUserVolume {
  workspace: string;
  volume: Volume;
}

export interface IVolumesRequest {
  items: IVolume[];
  pageInfo: IPageInfo;
}
