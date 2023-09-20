import './chat-message-image.scss';
import template from './chat-message-image.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ChatMessageImage extends Block<Props> {
  static componentName = 'ChatMessageImage';
  protected template = template;
}
