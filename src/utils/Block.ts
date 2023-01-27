import { BlockComponent, compile } from './handlebars';

interface RefType {
  [key: string]: Element | Block<object>
}

export abstract class Block<Props extends object, Refs extends object = RefType> implements BlockComponent {
  protected abstract template: string; // Handlebars-шаблон текущего компонента.
  protected props = {} as Props; // Свойства компонента. Будут переданы в шаблон во время рендеринга
  protected refs: Refs = {} as Refs; // ссылки на элементы внутри поддерева

  private children: Block<object>[] = []; // как таковой не нужен, храним только для того, чтобы было у кого вызывать unmount
  private domElement: Element | null = null; // Элемент в DOM, в который отрендерен этот компонент

  constructor(props: Props) {
    this.props = props;
  }

  public setProps(props: Props) {
    this.props = props;
    this.render();
  }

  public element(): Element {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement as Element;
  }

  // Автоматически вызываемые методы компонента: componentDidMount, componentWillUnmount
  protected componentDidMount() {
    // Метод будет вызван при встраивании компонента в DOM. На момент вызова уже всё встроено, DOM готов и доступен
    // В отличие от React, метод вызывается на КАЖДЫЙ перерендер, т.к. фактически точка монтирования каждый раз меняется
  }

  protected componentWillUnmount() {
    // Метод будет вызван при удалении компонента в DOM. На момент вызова DOM ещё есть. Это последний шанс почистить за собой
  }

  private render() {
    if (this.domElement) {
      this.componentWillUnmount();
      this.children.reverse().forEach(child => child.componentWillUnmount()); // вызываем очистку в порядке, обратном созданию
    }

    const fragment = this.compile();

    if (this.domElement) {
      this.domElement.replaceWith(fragment);
    }
    this.domElement = fragment;
    this.componentDidMount();
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
