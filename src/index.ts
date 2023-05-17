import { registerComponent, registerHelpers, registerPartial } from './utils/Handlebars';
import * as Components from './components';
import * as Pages from './pages';
import * as Partials from './partials';
import { router, Page } from './utils/Navigation';
import { authorized, checkIndex, tryToAuth } from './utils/Middleware';

document.addEventListener('DOMContentLoaded', () => {
  Object.entries(Components).forEach(([, component ]) => {
    registerComponent(component);
  });

  Object.entries(Partials).forEach(([ name, component ]) => {
    registerPartial(name, component);
  });

  registerHelpers();

  router
    .use(Page.chat, 'Чаты', Pages.ChatPage, [ tryToAuth, authorized ])
    .use(Page.login, 'Авторизация', Pages.LoginPage, [ tryToAuth, checkIndex ])
    .use(Page.registration, 'Регистрация', Pages.RegistrationPage)
    .use(Page.profile, 'Профиль', Pages.ProfilePage, [ tryToAuth, authorized ])
    .use(/.?/, 'Error', Pages.ErrorPage); // Всё, что не заматчилось, отображаем как ошибку

  router.start();
});
