import './profile-field.scss';
import template from './profile-field.hbs?raw';
import { Block } from '../../utils/Block';
import { ErrorLine, Input } from '../index';

interface Props {
  validate?: (value: string) => void | string;
  error?: string | undefined;
  value?: string;
  onBlur(): void;
}

type Refs = {
  input: Input;
  errorLine: ErrorLine;
}

export class ProfileField extends Block<Props, Refs> {
  static componentName = 'ProfileField';
  protected template = template;

  protected override customProps() {
    return {
      ...super.customProps(),
      // В материалах курса вадидация должна запускаться по фокусу, но выглядит это странно - ещё ничего не ввели, но уже ошибка,
      // поэтому проверку по фокусу выключил
      // onFocus: () => this.validate(),
      onBlur: this.validate.bind(this),
    };
  }

  public value() {
    if (!this.validate()) {
      return undefined;
    }
    return this.refs.input.value();
  }

  private validate() {
    const value = this.refs.input.value();
    const error = this.props.validate?.(value);
    if (error) {
      this.refs.errorLine.setProps({ error });
      return false;
    }
    this.refs.errorLine.setProps({ error: undefined });
    return true;
  }
}
