import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
import { createSandbox } from 'sinon';
import { Block } from '../utils/Block';
import { StoreBindings } from './StoreBindings';

type StoreInterface = { userId?: number, otherId?: number };

describe('Store', () => {
  use(sinonChai);
  const sandbox = createSandbox();

  afterEach(function() {
    sandbox.restore();
  });

  class Component extends Block<{ store?: StoreInterface }> {
    protected template = '';

    constructor(private store: StoreBindings<StoreInterface>) {
      super({});
    }

    public override setProps(): void {
      // empty
    }

    public override element() {
      return { isConnected: true } as Element;
    }

    public override render() {
      this.props.store = this.store.getBoundStore(this);
      this.props.store.userId; // Обращение к данным из стора создаёт подписку на изменение этой ветки стора
    }
  }

  it('Initial state', () => {
    const store = new StoreBindings({});
    expect(store.getStaticStore()).deep.equal({});
  });

  it('Update state', () => {
    const store = new StoreBindings({});
    store.updateStore({ userId: 123 });
    expect(store.getStaticStore()).deep.equal({ userId: 123 });
  });

  it('Component bindings', () => {
    const store = new StoreBindings<StoreInterface>({});

    const component = new Component(store);
    const setProps = sandbox.spy(component, 'setProps');

    component.render();
    expect(setProps).to.not.called;

    store.updateStore({ otherId: 123 });
    expect(setProps).to.not.called;

    store.updateStore({ userId: 123 });
    expect(setProps).to.have.been.calledWithMatch({ store: { userId: 123 } });
  });
});
