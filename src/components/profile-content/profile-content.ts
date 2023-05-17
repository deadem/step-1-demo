import './profile-content.scss';
import template from './profile-content.hbs?raw';
import { Block } from '../../utils/Block';
import { ProfileField } from '../index';
import { withStore, WithStoreProps } from '../../store/Store';
import { withValidation, WithValidationProps } from '../../utils/Validation';

interface Props extends WithStoreProps, WithValidationProps {
  upload?: boolean;
}

type Refs = {
  email: ProfileField;
  login: ProfileField;
  name: ProfileField;
  surname: ProfileField;
  nick: ProfileField;
  phone: ProfileField;
  password: ProfileField;
  passwordNew: ProfileField;
  passwordNewCopy: ProfileField;
  upload: HTMLElement;
};

export type ProfileContentFields = {
  email: string | undefined;
  login: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  nick: string | undefined;
  phone: string | undefined;
};

export type ProfileContentPassword = {
  password: string | undefined;
  passwordNew: string | undefined;
  passwordNewCopy: string | undefined;
};

@withStore
@withValidation
export class ProfileContent extends Block<Props, Refs> {
  static componentName = 'ProfileContent';
  protected template = template;
  protected override events = {
    upload: {
      click: () => { this.setProps({ upload: true }); }
    }
  };

  protected override customProps() {
    return {
      ...super.customProps(),
      onAddAvatar: this.updateAvatar.bind(this),
      validateNewPasswordCopy: (value: string) => {
        if (value != (this.refs.passwordNew.value() || '')) {
          return 'Пароли не совпадают';
        }
      }
    };
  }

  private updateAvatar(file: File) {
    return this.props.store.reducers.updateAvatar(file)
      .then(() => {
        this.setProps({ upload: false });
      });
  }

  public passwordFields(): ProfileContentPassword {
    return {
      password: this.refs.password.value(),
      passwordNew: this.refs.passwordNew.value(),
      passwordNewCopy: this.refs.passwordNewCopy.value(),
    };
  }

  public profileFields(): ProfileContentFields {
    return {
      email: this.refs.email.value(),
      login: this.refs.login.value(),
      name: this.refs.name.value(),
      surname: this.refs.surname.value(),
      nick: this.refs.nick.value(),
      phone: this.refs.phone.value(),
    };
  }
}
