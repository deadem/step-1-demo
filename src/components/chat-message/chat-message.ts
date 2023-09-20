import './chat-message.scss';
import template from './chat-message.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ChatMessage extends Block<Props> {
  static componentName = 'ChatMessage';
  protected template = template;
}
