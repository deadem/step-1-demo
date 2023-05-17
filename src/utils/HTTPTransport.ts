type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type SimpleDataObject = { [keys in string | number ]: string | number | undefined };
type DataObject = { [keys in string | number ]: string | number | undefined | DataObject[] } | string | number | undefined;
type Data = DataObject | FormData;

type Options = {
  headers?: { [key: string]: string },
  data?: Data;
  timeout?: number;
  withCredentials?: boolean | undefined;
  responseType?: XMLHttpRequestResponseType;
  signal?: AbortSignal;
}

class AbortSignal {
  public handler: () => void = () => undefined;
}

export class AbortController {
  public readonly signal = new AbortSignal();
  public abort() {
    this.signal.handler();
  }
}

function queryString(data: Record<string | number, string | number | undefined>) {
  return Object.entries(data)
    .filter((entry): entry is [ string, string | number ] => entry[1] != undefined)
    .map(([ name, value ]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
    .join('&');
}

export class HTTPTransport {
  private readonly prefix: string;

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  public get<T = unknown>(urlPart: string, { data, ...options }: Omit<Options, 'data'> & { data?: SimpleDataObject } = {}) {
    if (data && Object.keys(data).length) {
      const queryPart = queryString(data);
      if (queryPart) {
        urlPart += '?' + queryPart;
      }
    }

    return this.request<T>(urlPart, 'GET', options);
  }

  public put<T = unknown>(urlPart: string, options: Options = {}) {
    return this.request<T>(urlPart, 'PUT', options);
  }

  public post<T = unknown>(urlPart: string, options: Options = {}) {
    return this.request<T>(urlPart, 'POST', options);
  }

  public delete<T = unknown>(urlPart: string, options: Options = {}) {
    return this.request<T>(urlPart, 'DELETE', options);
  }

  private request<Response>(urlPart: string, method: Method, options: Options = {}): Promise<Response> {
    // 60 секунд умолчательный таймаут
    const { data, headers, signal, timeout = 60000, withCredentials = true, responseType = 'json' } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, `${this.prefix}${urlPart}`);

      if (signal) {
        signal.handler = () => { xhr.abort(); };
      }

      xhr.onload = () => {
        const status = xhr.status || 0;
        if (status >= 200 && status < 300) {
          resolve(xhr.response);
        } else {
          const message = {
            '0': 'abort',
            '100': 'Information',
            '200': 'Ok',
            '300': 'Redirect failed',
            '400': 'Access error',
            '500': 'Internal server error',
          }[Math.floor(status / 100) * 100];
          reject({ status, reason: xhr.response?.reason || message });
        }
      };
      xhr.onabort = () => reject({ reason: 'abort' });
      xhr.onerror = () => reject({ reason: 'network error' });
      xhr.ontimeout = () => reject({ reason: 'timeout' });

      Object.entries(headers ?? {}).forEach(([ key, value ]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.timeout = timeout;
      xhr.withCredentials = withCredentials;
      xhr.responseType = responseType;

      if (method === 'GET' || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
