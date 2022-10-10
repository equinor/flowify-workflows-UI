import { Observable, Observer } from 'rxjs';
import * as _superagent from 'superagent';
import { SuperAgentRequest } from 'superagent';

import { apiUrl } from './base';

const superagentPromise = require('superagent-promise');

/**
 * If node environment is development add Bearer token for test user to request
 * @param req
 * @returns req
 */
const auth = (req: SuperAgentRequest) => {
  if (process.env.NODE_ENV === 'development') {
    return req.set(
      'Authorization',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYW5kYm94IiwiYXVkIjoiZmxvd2lmeSIsImlhdCI6MTY2MzY3NDU0NywibmJmIjoxNjYzNjc0NTQ3LCJleHAiOjI2MTA0NDU3NDcsIm9pZCI6IjgwNDgiLCJuYW1lIjoiRi4gTG93ZSIsImVtYWlsIjoiZmxvd0BzYW5kLmJveCIsInJvbGVzIjpbInNhbmRib3gtZGV2ZWxvcGVyIl19.Hc4gXrL6hsE91S6qlJpFfsONq7L-jTN9WsHxtC1fhGk',
    );
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
    return Observable.create((observer: Observer<any>) => {
      const eventSource = new EventSource(apiUrl(url));
      // an null event is the best way I could find to get an event whenever we open the event source
      // otherwise, you'd have to wait for your first message (which maybe some time)
      eventSource.onopen = () => observer.next(null);
      eventSource.onmessage = (x) => observer.next(x.data);
      eventSource.onerror = (x) => {
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
