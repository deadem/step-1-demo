import Handlebars, { HelperOptions } from 'handlebars';
import { Block } from './utils/Block';

export interface BlockComponent {
  content(): Element;
}

export function compile(template: string, context: Record<string, unknown>) {
  const data = { ...context, __children: [] as Array<{ component: Block, embed(node: DocumentFragment): void }> };
  const html = Handlebars.compile(template)(data);
  return { html, children: data.__children };
}

let uniqueId = 0; // Идентификатор текущего компонента. Используется во время рендеринга для подстановки дочерних компонентов.

// NB: Не поддерживается перерендер компонентов с детьми, вида {{#A ...}}...{{/A}}
export function registerComponent<T extends BlockComponent>(Component: { new (...args: Record<string, unknown>[]): T }) {
  Handlebars.registerHelper(Component.name,
    function (this: unknown, { hash, data, fn }: HelperOptions) {
      const component = new Component(hash);
      const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

      (data.root.__children = data.root.__children || []).push({ component, embed(node: DocumentFragment) {
        // Ищем среди детей плейсхолдеры для размещения компонентов и заменяем заглушки на реальные компоненты
        const placeholder = node.querySelector(`[${dataAttribute}]`);
        if (!placeholder) {
          throw new Error(`Can't find data-id for component ${component.constructor.name}`);
        }

        const element = component.content();
        element.append(...Array.from(placeholder.childNodes));
        placeholder.replaceWith(element);
      }});

      const contents = fn ? fn(this) : '';
      return `<div ${dataAttribute}>${contents}</div>`;
    },
  );
}

export function registerHelpers() {
  Handlebars.registerHelper('append', (str, suffix) => String(str) + suffix);
}
