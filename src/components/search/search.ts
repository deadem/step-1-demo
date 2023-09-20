import './search.scss';
import template from './search.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class Search extends Block<Props> {
  static componentName = 'Search';
  protected template = template;
}
