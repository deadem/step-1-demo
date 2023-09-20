import './chat-footer.scss';
import template from './chat-footer.hbs?raw';
import { Block } from '../../utils/Block';
import { withStore, WithStoreProps } from '../../store/Store';

interface Props extends WithStoreProps {
}

type Refs = {
  form: HTMLFormElement;
  input: HTMLInputElement;
}

@withStore
export class ChatFooter extends Block<Props, Refs> {
  static componentName = 'ChatFooter';
  protected template = template;
  protected override events = {
    form: {
      submit: this.onSubmit.bind(this),
    }
  };

  private onSubmit(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();

    this.props.store.reducers.addMessage(this.refs.input.value);
    this.refs.input.value = '';
  }
}
