import { Block } from './Block';

export class Route<Middleware> {
  private readonly path: string | RegExp;
  private readonly title: string;
  private readonly block: new (props: object) => Block<object>;
  private readonly middleware: Middleware[];
  private destroyCallback: (() => void) | undefined;

  constructor(path: string | RegExp, title: string, block: typeof Block, middleware: Middleware[]) {
    this.path = path;
    this.title = title;
    this.block = block as typeof this.block;
    this.middleware = middleware;
  }

  public match(path: string): boolean {
    if (typeof this.path == 'string') {
      return this.path == path;
    }

    return !!path.match(this.path);
  }

  public render(element: Element) {
    const content = new this.block({});

    document.title = this.title;
    element.innerHTML = '';
    element.append(content.element());

    this.destroyCallback = content.destroy.bind(content);
  }

  public middlewares() {
    return this.middleware;
  }

  public leave() {
    this.destroyCallback?.();
    this.destroyCallback = undefined;
  }
}
