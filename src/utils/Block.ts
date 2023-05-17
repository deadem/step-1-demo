import { BlockComponent, compile } from './Handlebars';

type RefType = {
  [key: string]: Element | Block<object>
}

type EventListType = { [key: string]: ((e: Event) => void) | undefined; };
type EventsType<Refs> = { [key in keyof Refs]?: EventListType } | EventListType;

export abstract class Block<Props extends object, Refs extends RefType = RefType> implements BlockComponent {
  // Handlebars-шаблон текущего компонента.
  protected abstract template: string;
  // Свойства компонента. Будут переданы в шаблон во время рендеринга
  protected props = {} as Props;
  // Ссылки на элементы внутри поддерева
  protected refs = {} as Refs;
  // События, которые будут автоматически подключены к указанным refs или this.element()
  // Просто сахар, чтобы не навешиваться руками в componenDidMount
  // При передаче { event: callback } подключится к this.element()
  // При передаче { ref: { event: callback } } подключится к указанному ref
  protected readonly events = {} as EventsType<Refs>;

  // как таковой список не нужен, храним только для того, чтобы было у кого вызывать unmount
  private children: Block<object>[] = [];
  // Элемент в DOM, в который отрендерен этот компонент
  private domElement: Element | null = null;

  constructor(props: Props) {
    this.props = props;
    // Расширяем props набором свойств из customProps
    Object.entries(this.customProps()).forEach(([ key, value ]) => {
      this.props[key as keyof Props] = value;
    });
  }

  // Метод для расширения набора свойств, вызывается после сборки конструктора.
  // На момент вызова все основные свойства уже находятся в this.props
  protected customProps(): Props {
    return {} as Props;
  }

  // Обновить свойства. Передаваемые значения "мержатся" с уже существующими
  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props };
    this.render();
  }

  public element(): Element {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement as Element;
  }

  // Разрушить компонент
  public destroy() {
    this.unmountComponent();
    if (this.domElement) {
      this.domElement.replaceWith(document.createElement('template'));
    }
  }

  // Автоматически вызываемые методы компонента: componentDidMount, componentWillUnmount
  protected componentDidMount() {
    // Метод будет вызван при встраивании компонента в DOM. На момент вызова уже всё встроено, DOM готов и доступен.
    // В отличие от React, метод вызывается на КАЖДЫЙ перерендер, т.к. фактически точка монтирования каждый раз меняется.
  }

  protected componentWillUnmount() {
    // Метод будет вызван при удалении компонента в DOM. На момент вызова DOM ещё есть. Это последний шанс почистить за собой.
  }

  // Подключаем все листенеры с непустыми обработчиками
  private attachListeners() {
    const addEventListener = (element: Element | Block<object>, event: string, callback: ((e: Event) => void) | undefined) => {
      if (element && callback) {
        (element instanceof Element ? element : element.element()).addEventListener(event, callback);
      }
    };

    for (const refOrEvent in this.events) {
      const eventsOrCallback = this.events[refOrEvent];
      if (typeof eventsOrCallback == 'function') {
        addEventListener(this.element(), refOrEvent, eventsOrCallback);
      } else {
        for (const event in eventsOrCallback) {
          addEventListener(this.refs[refOrEvent], event, eventsOrCallback[event]);
        }
      }
    }
  }

  // Отключаем все листенеры
  private removeListeners() {
    // Отключать обработчики при разрушении компонента нет необходимости:
    // все элементы, к которым они подключены, будут уничтожены и отключатся сами.
    // this.domElement на каждый рендер будет создан новый
  }

  // Метод подключает обработчики и вызывает componentDidMount
  private mountComponent() {
    this.attachListeners();
    this.componentDidMount();
  }

  // Метод вызывает componentWillUnmount и отключение событий у себя, а затем, рекурсивно, и у всех детей
  private unmountComponent() {
    if (this.domElement) {
      this.componentWillUnmount();
      this.removeListeners();
      this.children.reverse().forEach(child => child.unmountComponent()); // вызываем очистку в порядке, обратном созданию
    }
  }

  protected render() {
    this.unmountComponent();

    const fragment = this.compile();

    if (this.domElement) {
      this.domElement.replaceWith(fragment);
    }
    this.domElement = fragment;
    this.mountComponent();
  }

  private compile() {
    const { html, children, refs } = compile(this.template, this.props);
    this.children = children.map(child => child.component as Block<object>);

    const templateElement = document.createElement('template');
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    // Инициализация списка ссылок на элементы
    this.refs = Array.from(fragment.querySelectorAll('[ref]')).reduce((list, element) => {
      const key = element.getAttribute('ref') as string;
      list[key] = element as HTMLElement;
      element.removeAttribute('ref');
      return list;
    }, refs) as Refs;

    children.forEach(child => child.embed(fragment));

    if (!fragment.firstElementChild || fragment.firstElementChild?.nextElementSibling) {
      console.error(fragment);
      throw Error('Only one root supported');
    }

    return fragment.firstElementChild;
  }
}
