import { Block } from './Block';
import { StoreBindings } from './StoreBindings';
import { Store } from './StoreInterface';

// Статический класс для ленивой инициализации стора
class Storage {
  static store: StoreBindings<Store>;

  static bingings() {
    if (!this.store) {
      this.store = new StoreBindings();
    }

    return this.store;
  }
}

export type WithStoreProps = {
  store: DeepReadonly<Store>;
}

// Декоратор, автоматически добавляющий в класс Store
// У свойств оборачиваемого компонента резервируется свойство store. К нему можно обращаться, но нельзя переопределять его тип.
// При подключении проверяем наличие свойства store в Props.
// В момент создания зависимых классов у них свойство store появится только в процессе рендера.
// Так сделано для того, чтобы те, кто "потрогал" стор, автоматически подписались на уведомления о его изменениях
export function withStore<Props extends WithStoreProps, T extends Constructor<Block<Props>>>(constructor: T): T {
  return class extends constructor {
    protected template!: string; // Тушим предупреждение TS: это абстрактное свойство будет определено в настоящем наследнике от Block<>

    protected override render() {
      this.props.store = Storage.bingings().getBoundStore(this);
      return super.render();
    }

    protected override componentWillUnmount(): void {
      super.componentWillUnmount();
      Storage.bingings().unregisterBinding(this);
    }
  };
}

// Обновление значений в сторе
export function updateStore(store: Partial<Store>, replace = false) {
  Storage.bingings().updateStore(store, replace);
}

export function staticStore() {
  return Storage.bingings().getStaticStore();
}