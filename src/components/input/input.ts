import './input.scss';
import { default as template } from './input.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class Input extends Block<Props> {
  static componentName = 'Input';
  protected template = template;
}
