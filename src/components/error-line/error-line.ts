import './error-line.scss';
import template from './error-line.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
  error?: string;
}

type Refs = {
  // empty
}

export class ErrorLine extends Block<Props, Refs> {
  static componentName = 'ErrorLine';
  protected template = template;
}
