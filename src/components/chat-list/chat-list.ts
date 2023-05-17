import './chat-list.scss';
import template from './chat-list.hbs?raw';
import { Block } from '../../utils/Block';
import { withStore, WithStoreProps } from '../../store/Store';

type Props = WithStoreProps & {
  // empty
};

@withStore
export class ChatList extends Block<Props> {
  static componentName = 'ChatList';
  protected template = template;
}
