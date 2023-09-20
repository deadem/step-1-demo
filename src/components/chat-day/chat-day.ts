import './chat-day.scss';
import template from './chat-day.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ChatDay extends Block<Props> {
  static componentName = 'ChatDay';
  protected template = template;
}
