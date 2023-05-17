import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import { Middleware, Router } from './Router';
import { Route } from './Route';
import { Block } from './Block';

describe('Router', () => {
  use(sinonChai);
  const sandbox = createSandbox();

  class ChatPage extends Block<object> {
    protected template = '';
  }

  class DefaultPage extends Block<object> {
    protected template = '';
  }

  afterEach(function() {
    sandbox.restore();
  });

  it('Route path', () => {
    const router = new Router({} as Element);
    const render = sandbox.stub(Route.prototype, 'render').callsFake(function(this: Route<void>) { return this['block']; });

    router
      .use('/messages/', 'Messages', ChatPage)
      .use(/.?/, 'Default', DefaultPage);

    router['renderPage']('/');
    expect(render).returned(DefaultPage);

    router['renderPage']('/messages');
    expect(render).returned(DefaultPage);

    router['renderPage']('/messages/');
    expect(render).returned(ChatPage);
  });

  it('Middleware', () => {
    const router = new Router({} as Element);
    const render = sandbox.stub(Route.prototype, 'render').callsFake(function(this: Route<void>) { return this['block']; });

    let count = 0;
    const secondCall: Middleware = (_router, next) => {
      if (++count > 1) {
        return next();
      }

      throw new Error('skip');
    };

    router
      .use('/messages/', 'Messages', ChatPage, [ secondCall ])
      .use(/.?/, 'Default', DefaultPage);

    const testFn = () => router['renderPage']('/messages/');
    expect(testFn).to.throw(/skip/);

    expect(testFn).to.not.throw();
    expect(render).returned(ChatPage);
  });
});
