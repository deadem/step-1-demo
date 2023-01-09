import Handlebars from 'handlebars/runtime';
import './chat-content.scss';
import { message } from './chat-content';
export { default as ChatContent } from './chat-content.hbs';

Handlebars.registerHelper('chat-content', (section) => message[section]);
