import { Observable, Observer } from 'rxjs';
import * as _superagent from 'superagent';
import { SuperAgentRequest } from 'superagent';
import { apiUrl } from './base';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { environment } from '../environments/environment';
const superagentPromise = require('superagent-promise');

const EventSource = process.env.NODE_ENV === 'development' ? EventSourcePolyfill : NativeEventSource;

/**
 * If node environment is development add Bearer token for test user to request
 * @param req
 * @returns req
 */
const auth = (req: SuperAgentRequest) => {
  if (process.env.NODE_ENV === 'development') {
    return req.set('Authorization', environment?.bearerToken);
  }
  return req;
};

const superagent: _superagent.SuperAgentStatic = superagentPromise(_superagent, global.Promise);

export class Request {
  get(url: string) {
    return auth(superagent.get(apiUrl(url)));
  }

  post(url: string) {
    return auth(superagent.post(apiUrl(url)).set('Content-Type', 'application/json'));
  }

  put(url: string) {
    return auth(superagent.put(apiUrl(url)));
  }

  patch(url: string) {
    return auth(superagent.patch(apiUrl(url)));
  }

  delete(url: string) {
    return auth(superagent.del(apiUrl(url)));
  }

  loadEventSource(url: string): Observable<string> {
    return new Observable((observer: Observer<any>) => {
      const eventSource = new EventSource(
        apiUrl(url),
        process.env.NODE_ENV === 'development' ? { headers: { Authorization: environment?.bearerToken } } : undefined,
      );
      // an null event is the best way I could find to get an event whenever we open the event source
      // otherwise, you'd have to wait for your first message (which maybe some time)
      eventSource.onopen = () => observer.next(null);
      eventSource.onmessage = (x: any) => observer.next(x.data);
      eventSource.onerror = (x: any) => {
        switch (eventSource.readyState) {
          case EventSource.CONNECTING:
            observer.error(new Error('Failed to connect to ' + url));
            break;
          case EventSource.OPEN:
            observer.error(new Error('Error in open connection to ' + url));
            break;
          case EventSource.CLOSED:
            observer.error(new Error('Connection closed to ' + url));
            break;
          default:
            observer.error(new Error('Unknown error with ' + url));
        }
      };

      return () => {
        eventSource.close();
      };
    });
  }
}

export const requests: Request = new Request();
