import { Block } from './Block';
import { Route } from './Route';

export type Middleware = (router: Router, next: () => void) => void;

export class Router {
  private routes: Route<Middleware>[] = [];
  private currentRoute: Route<Middleware> | null = null;
  private readonly rootMountPoint: Element;

  public constructor(mountPoint?: Element) {
    this.rootMountPoint = mountPoint || document.body;
  }

  public use<T extends Constructor<Block<object>>>(
    path: string | RegExp, title: string, block: T, middleware: Middleware | Middleware[] = ((_router, next) => next())
  ) {
    this.routes.push(new Route(path, title, block as typeof Block, Array.isArray(middleware) ? middleware : [ middleware ]));

    return this;
  }

  public start() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      this.renderPage(target.location.pathname);
    });

    this.renderPage(window.location.pathname);
  }

  public go(path: string) {
    window.history.pushState({}, '', path);
    this.renderPage(path);
  }

  private findRoute(path: string) {
    return this.routes.find(route => route.match(path));
  }

  private renderPage(path: string) {
    const route = this.findRoute(path);

    if (!route) {
      throw new Error('Can\'t find route');
    }

    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }
    this.currentRoute = route;

    // Непосредственно обработчик рендеров. Будет вызван самой последней мидлварью, если никто по пути не отменит запрос
    const next = () => route.render(this.rootMountPoint);

    // Рекурсивно вложим вызовы мидлварей чтобы вызову первой передавался в качестве next вызов последующей.
    route.middlewares().reduceRight((next: () => void, middleware) => {
      return () => middleware(this, next);
    }, next)();
  }
}
