import './page-title.scss';
import { default as template } from './page-title.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class PageTitle extends Block<Props> {
  static componentName = 'PageTitle';
  protected template = template;
}
