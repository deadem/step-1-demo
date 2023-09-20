import './button.scss';
import template from './button.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
  onClick?(e: Event): void;
}

export class Button extends Block<Props> {
  static componentName = 'Button';
  protected template = template;
  protected override events = {
    click: this.props.onClick,
  };
}
