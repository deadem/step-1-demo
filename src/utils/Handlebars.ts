import Handlebars, { HelperOptions } from 'handlebars';

export interface BlockComponent {
  element(): Element;
}

interface BlockComponentClass<T> extends BlockComponent {
  new (props: unknown): T;
}

type StaticMethods = {
  componentName: string;
};

export function compile(template: string, context: object) {
  // Ожидаем, что родитель после создания вызовет у каждого children метод embed для встраивания сгенерированнной разметки в реальный DOM
  const data = {
    ...context,
    __children: [] as Array<{ component: unknown, embed(node: DocumentFragment): void }>,
    __refs: {} as Record<string, unknown>
  };
  const html = Handlebars.compile(template)(data);
  return { html, children: data.__children, refs: data.__refs };
}

let uniqueId = 0; // Идентификатор текущего компонента. Используется во время рендеринга для подстановки дочерних компонентов.

type ComponentType<T extends BlockComponentClass<T>> = { new (props: ConstructorParameters<InstanceType<T>>[0]): InstanceType<T> } & StaticMethods;

export function registerComponent<T extends BlockComponentClass<T>>(Component: ComponentType<T>) {
  if (Component.componentName in Handlebars.helpers) {
    throw `The ${Component.componentName} component is already registered!`;
  }

  Handlebars.registerHelper(Component.componentName, function (this: unknown, { hash, data, fn }: HelperOptions) {
    const component = new Component(hash);
    const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

    if ('ref' in hash) {
      // если в свойствах компонента кто-то хочет получить на него ссылку - сохраним
      (data.root__refs = data.root.__refs || {})[hash.ref] = component;
    }

    (data.root.__children = data.root.__children || []).push({ component, embed(node: DocumentFragment) {
      // Ищем среди детей плейсхолдеры для размещения компонентов и заменяем заглушки на реальные компоненты
      const placeholder = node.querySelector(`[${dataAttribute}]`);
      if (!placeholder) {
        throw new Error(`Can't find data-id for component ${Component.componentName}`);
      }

      const element = component.element();
      element.append(...Array.from(placeholder.childNodes));
      placeholder.replaceWith(element);
    }});

    // NB: Не поддерживается перерендер компонентов с детьми, вида {{#A ...}} ... {{/A}}
    const contents = fn ? fn(this) : '';
    return `<div ${dataAttribute}>${contents}</div>`;
  });
}

function localDate(time: Date) {
  const today = new Date().getTime();
  const msInDay = 86400000;

  if (!time) {
    return;
  }

  if (time.getTime() > today - msInDay) {
    return time.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  if (time.getTime() > today - msInDay * 5) {
    return time.toLocaleString('ru-RU', { weekday: 'short' });
  }

  return time.toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });

}


export function registerHelpers() {
  Handlebars.registerHelper('append', (str, suffix) => String(str) + suffix);
  Handlebars.registerHelper('equals', (arg1, arg2) => (arg1 == arg2));
  Handlebars.registerHelper('localDate', (time) => localDate(time));
  Handlebars.registerHelper('localTime', (time) => time.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
}

export function registerPartial(name: string, component: string) {
  if (name in Handlebars.partials) {
    throw `The ${name} partial is already registered!`;
  }

  Handlebars.registerPartial(name, component);
}
