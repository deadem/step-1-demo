import './upload-file.scss';
import template from './upload-file.hbs?raw';
import { Block } from '../../utils/Block';
import { ErrorLine } from '../index';

interface Props {
  onSubmit: (file: File) => Promise<void>;
}

type Refs = {
  form: HTMLFormElement;
  file: HTMLInputElement;
  errorLine: ErrorLine
}

export class UploadFile extends Block<Props, Refs> {
  static componentName = 'UploadFile';
  protected template = template;
  protected override events = {
    form: {
      submit: (e: Event) => this.onSubmit(e),
    }
  };

  private onSubmit(e: Event) {
    e.preventDefault();
    const file = this.refs.file.files?.[0];
    this.refs.errorLine.setProps({ error: undefined });
    if (!file) {
      this.refs.errorLine.setProps({ error: 'Не выбран файл' });
      return;
    }

    this.props.onSubmit(file).catch(error => {
      this.refs.errorLine.setProps({ error: error?.reason || 'Неизвестная ошибка' });
    });
  }
}
