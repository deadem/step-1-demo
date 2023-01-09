import Handlebars from 'handlebars/runtime';
import * as Components from './components';
import * as Pages from './pages';

const pages = {
  'chat': [ Pages.ChatPage ],
  'chat-menu-user': [ Pages.ChatPage, { menu: true } ],
  'chat-user-add': [ Pages.ChatPage, { useradd: true } ],
  'error': [ Pages.ErrorPage ],
  'login': [ Pages.LoginPage ],
  'profile': [ Pages.ProfilePage ],
  'profile-avatar-upload': [ Pages.ProfilePage, { upload: true } ],
  'profile-edit': [ Pages.ProfilePage, { edit: true } ],
  'profile-edit-password': [ Pages.ProfilePage, { edit: true, password: true } ],
  'registration': [ Pages.RegistrationPage ],
};

Object.entries(Components).forEach(([ name, component ]) => {
  Handlebars.registerPartial(name, component);
});

function navigate(page) {
  const [ render, args ] = pages[page];
  document.body.innerHTML = render(args);
}

document.addEventListener('DOMContentLoaded', () => navigate('login'));

document.addEventListener('click', e => {
  const page = e.target.getAttribute('page');
  if (page) {
    navigate(page);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
