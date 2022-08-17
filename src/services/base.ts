import { environment } from '../environments/environment';

export function apiUrl(apiPath: string): string {
  return `${environment.baseUri}${apiPath}`;
}
