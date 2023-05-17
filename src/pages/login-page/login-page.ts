import './login-page.scss';
import template from './login-page.hbs?raw';
import { Block } from '../../utils/Block';
import { ErrorLine, InputField } from '../../components';
import { withNavigation, WithNavigationProps } from '../../utils/Navigation';
import { withValidation, WithValidationProps } from '../../utils/Validation';
import { withStore, WithStoreProps } from '../../store/Store';

interface Props extends WithNavigationProps, WithValidationProps, WithStoreProps {
}

type Refs = {
  login: InputField;
  password: InputField;
  form: HTMLElement;
  errorLine: ErrorLine;
};

@withNavigation
@withValidation
@withStore
export class LoginPage extends Block<Props, Refs> {
  static componentName = 'LoginPage';
  protected template = template;
  protected override events = {
    form: {
      'submit': this.login.bind(this)
    }
  };

  private login(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const login = this.refs.login.value();
    const password = this.refs.password.value();

    this.refs.errorLine.setProps({ error: undefined });

    if (login && password) {
      this.props.store.reducers.signin(login, password).catch(error => {
        this.refs.errorLine.setProps({ error: error?.reason || 'Неизвестная ошибка' });
      });
    }
  }
}
