import './profile-field.scss';
import { default as template } from './profile-field.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ProfileField extends Block<Props> {
  static componentName = 'ProfileField';
  protected template = template;
}
