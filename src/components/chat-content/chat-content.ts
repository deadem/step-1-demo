import './chat-content.scss';
import template from './chat-content.hbs?raw';
import { Block } from '../../utils/Block';
import { withStore, WithStoreProps } from '../../store/Store';

type Props = WithStoreProps & {
  //
};

type Refs = {
  page: HTMLDivElement;
};

@withStore
export class ChatContent extends Block<Props, Refs> {
  static componentName = 'ChatContent';
  protected template = template;

  protected override componentDidMount() {
    this.refs.page.scrollTop = 1000000;
  }
}
