import { HTTPTransport } from '../utils/HTTPTransport';

const api = 'https://ya-praktikum.tech/api/v2'; // swagger: https://ya-praktikum.tech/api/v2/swagger

export abstract class API {
  private readonly api: string;
  private httpTransport?: HTTPTransport;

  constructor(path: string) {
    this.api = `${api}${path}`;
  }

  protected transport() {
    if (!this.httpTransport) {
      this.httpTransport = new HTTPTransport(this.api);
    }

    return this.httpTransport;
  }
}
