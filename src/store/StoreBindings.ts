import { Block } from '../utils/Block';

type Component = Block<object>;

// Реализация байндинга стора к компонентам, которые к нему обращаются.
// При обращении к стору он запоминает, какой компонент запросил у него данные и при изменении этих данных
// вызовет перерендер зависимого от них компонента через setProps с новым значением props.store
export class StoreBindings<Store extends Record<string | number | symbol, unknown>>  {
  private store: Store;
  private bindings = {} as {
    [keys in keyof Store]?: Component[]
  };

  constructor(store: Store = {} as Store) {
    this.store = store;
  }

  // Изменение стора. Если какой-то компонент зависит от изменённого свойства, у него будет вызван setProps
  updateStore(store: Partial<Store>, replace = false) {
    const updatedStore = { ...(replace ? {} : this.store), ...store as Store };
    const updateList = [] as Component[];
    // Рассчитываем, что в store никогда не будет больше ключей, чем уже есть в this.store
    (Object.keys(updatedStore) as Array<keyof Store>).forEach(prop => {
      // Если изменилось какое-либо свойство, добавляем компонент в список на обновление
      if (this.store[prop] !== updatedStore[prop]) {
        (this.bindings[prop] ?? []).forEach(component => {
          if (updateList.indexOf(component) < 0) {
            updateList.push(component);
          }
        });
      }
    });

    // Изменяем значения в сторе
    this.store = updatedStore;

    // Вызываем обновления для списка компонентов.
    updateList.forEach(component => {
      // Если компонент уже выключен из DOM (находится в фазе разрушения), не отправляем ему обновление
      if (component.element().isConnected) {
        component.setProps({ store: this.getBoundStore(component) });
      }
    });
  }

  // Зарегистрировать зависимость компонента component от значения в сторе
  registerBinding(component: Component, prop: keyof Store) {
    const list = this.bindings[prop] ?? [];
    if (list.indexOf(component) >= 0) {
      // уже зарегистрирован
      return;
    }
    list.push(component);
    this.bindings[prop] = list;
  }

  // "Забыть" про компонент
  unregisterBinding(component: Component) {
    (Object.keys(this.bindings) as Array<keyof Store>).forEach(prop => {
      this.bindings[prop] = (this.bindings[prop] ?? []).filter(i => i != component);
    });
  }

  // Каждый раз возвращает новый прокси-объект для отслеживания обращений к стору
  getBoundStore<T extends Component>(component: T): DeepReadonly<Store> {
    return new Proxy(this.store, {
      get: (obj: Store, prop: keyof Store) => {
        this.registerBinding(component, prop);
        return obj[prop];
      },
    });
  }

  // Получение текущего среза стора. Обращения не отслеживаются
  getStaticStore(): DeepReadonly<Store> {
    return this.store;
  }
}
