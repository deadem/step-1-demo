import './chat-content.scss';
import template from './chat-content.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ChatContent extends Block<Props> {
  static componentName = 'ChatContent';
  protected template = template;

  constructor() {
    super(message);
  }
}

const message = {
  date: {
    text: '19 июня',
    datetime: '2000-06-19'
  },
  message: {
    text: [
      'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.',
      'Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.'
    ],
    time: '11:56',
  },
  'imageMessage': {
    image: new URL('../../assets/chat-message-image.png', import.meta.url),
    time: '12:03',
  },
  'myMessage': {
    text: [
      'Круто!'
    ],
    time: '12:33',
  },
  'errorMessage': {
    text: [
      '<a href page=\'error\'>Ссылка на страницу с ошибкой</a>'
    ],
    time: '13:22',
  },
};