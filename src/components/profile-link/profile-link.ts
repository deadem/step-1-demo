import './profile-link.scss';
import template from './profile-link.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
}

export class ProfileLink extends Block<Props> {
  static componentName = 'ProfileLink';
  protected template = template;
}
