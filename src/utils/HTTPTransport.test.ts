import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import { HTTPTransport} from './HTTPTransport';

describe('HTTP Transport', () => {
  use(sinonChai);
  const sandbox = createSandbox();

  afterEach(function() {
    sandbox.restore();
  });

  it('Simple query', () => {
    const http = new HTTPTransport();
    const request = sandbox.stub(http, 'request' as keyof typeof http).callsFake(() => Promise.resolve());

    http.get('', { data: { a: '1', b: '2' } });
    expect(request).calledWithMatch('?a=1&b=2', 'GET');

    http.get('', { data: { a: 1, b: 'string' } });
    expect(request).calledWithMatch('?a=1&b=string', 'GET');
  });

  it('Plus sign in query', () => {
    const http = new HTTPTransport();
    const request = sandbox.stub(http, 'request' as keyof typeof http).callsFake(() => Promise.resolve());

    http.get('', { data: { a: '1+2', b: '2 2' } });
    expect(request).calledWithMatch('?a=1%2B2&b=2%202', 'GET');
    request.resetHistory();
  });


  it('Special chars in query', () => {
    const http = new HTTPTransport();
    const request = sandbox.stub(http, 'request' as keyof typeof http).callsFake(() => Promise.resolve());

    http.get('', { data: { a: '1=2&1' } });
    expect(request).calledWithMatch('?a=1%3D2%261', 'GET');
    request.resetHistory();

    http.get('', { data: { 'a=x&4': 'q=w&e' } });
    expect(request).calledWithMatch('?a%3Dx%264=q%3Dw%26e', 'GET');
    request.resetHistory();

    http.get('', { data: { 'a="x"': 'q="2"' } });
    expect(request).calledWithMatch('?a%3D%22x%22=q%3D%222%22', 'GET');
    request.resetHistory();
  });
});

