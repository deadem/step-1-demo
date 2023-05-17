import './chat-page.scss';
import template from './chat-page.hbs?raw';
import { Block } from '../../utils/Block';
import { withStore, WithStoreProps } from '../../store/Store';

interface Props extends WithStoreProps {
}

@withStore
export class ChatPage extends Block<Props> {
  static componentName = 'ChatPage';
  protected template = template;

  public override destroy() {
    this.props.store.reducers.destroyChat();
  }

  protected override componentDidMount(): void {
    this.props.store.reducers.updateChatList();
  }
}
