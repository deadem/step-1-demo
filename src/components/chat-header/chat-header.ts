import './chat-header.scss';
import plus from '../../assets/plus_icon.svg';
import cross from '../../assets/cross_icon.svg';
import template from './chat-header.hbs?raw';
import { Block } from '../../utils/Block';
import { withStore, WithStoreProps } from '../../store/Store';

type Props = WithStoreProps & {
  dialogTitle?: string;
  menu?: { icon: string; text: string; }[] | undefined;
};

type Refs = {
  button: HTMLElement;
};

@withStore
export class ChatHeader extends Block<Props, Refs> {
  static componentName = 'ChatHeader';
  protected template = template;
  protected override events = {
    button: {
      click: (e: Event) => this.showMenu(e)
    }
  };

  private menu = [
    {
      icon: plus,
      text: 'Добавить пользователя',
      onClick: { onSubmit: this.onUserAdd.bind(this), dialogTitle: 'Добавить пользователя', text: 'Добавить' }
    },
    {
      icon: cross,
      text: 'Удалить пользователя',
      onClick: { onSubmit: this.onUserRemove.bind(this), dialogTitle: 'Удалить пользователя', text: 'Удалить' }
    },
  ];

  protected override customProps() {
    return {
      ...super.customProps(),
      onClickMenu: (id: number) => this.setProps({ menu: undefined, ...this.menu[id].onClick }),
      name: () => this.props.store.chats?.filter(chat => chat.id == this.props.store.currentChat)[0]?.name,
    };
  }

  private showMenu(e: Event) {
    e.stopPropagation();
    this.setProps({ menu: this.menu });
  }

  private closeMenu() {
    this.setProps({ menu: undefined, dialogTitle: undefined });
  }

  private onUserAdd({ value }: ({ value: string })) {
    this.props.store.reducers.addUser(value).catch(e => {
      console.error(e);
    }).finally(() => this.closeMenu());
  }

  private onUserRemove({ value }: ({ value: string })) {
    this.props.store.reducers.removeUser(value).catch(e => {
      console.error(e);
    }).finally(() => this.closeMenu());
  }

  protected override componentDidMount(): void {
    // Пока не реализован функционал меню, тут сами управляем его показом-скрытием, исключительно для демонстрации динамики.
    const handler = () => {
      if (this.props.menu) {
        document.removeEventListener('click', handler);
        this.setProps({ menu: undefined });
      }
    };
    document.addEventListener('click', handler);
  }
}

