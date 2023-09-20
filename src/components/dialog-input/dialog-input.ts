import './dialog-input.scss';
import template from './dialog-input.hbs?raw';
import { Block } from '../../utils/Block';
import { InputField } from '../index';

interface Props {
  onSubmit: (props: { value: string }) => void;
}

type Refs = {
  form: HTMLFormElement;
  input: InputField
}

export class DialogInput extends Block<Props, Refs> {
  static componentName = 'DialogInput';
  protected template = template;
  protected override events = {
    form: {
      submit: (e: Event) => this.onSubmit(e)
    }
  };

  protected override componentDidMount() {
    // отложим до полного окончания рендеринга всех компонентов, чтобы корректно поставить фокус в поле ввода
    setTimeout(() => this.refs.input.focus());
  }

  private onSubmit(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    const value = this.refs.input.value();
    if (value) {
      this.props.onSubmit({ value });
    }
  }
}
