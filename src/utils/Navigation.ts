import { Block } from './Block';
import { Router } from './Router';

export const router = new Router();

export const enum Page {
  chat = '/messenger',
  login = '/',
  registration = '/sign-up',
  profile = '/settings',
}

function navigate(page: Page) {
  router.go(page);
}

export const NavigateTo = {
  chat() {
    navigate(Page.chat);
  },
  login() {
    navigate(Page.login);
  },
  registration() {
    navigate(Page.registration);
  },
  profile() {
    navigate(Page.profile);
  }
};

export type WithNavigationProps = {
  navigateTo: typeof NavigateTo;
}

export function withNavigation<Props extends WithNavigationProps, T extends Constructor<Block<Props>>>(constructor: T): T {
  return class extends constructor {
    protected template!: string;

    // Вынуждены использовать any[], см. ts(2545)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      const [ props ] = args;
      super({
        ...props,
        navigateTo: NavigateTo
      } as WithNavigationProps);
    }
  };
}
