import './link.scss';
import template from './link.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
  onClick?(e: Event): void;
}

export class Link extends Block<Props> {
  static componentName = 'Link';
  protected template = template;
  protected override events = {
    click: this.props.onClick
  };
}
