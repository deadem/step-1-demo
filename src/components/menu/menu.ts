import './menu.scss';
import template from './menu.hbs?raw';
import { Block } from '../../utils/Block';

interface Props {
  onClick: (index: number) => void;
}

export class Menu extends Block<Props> {
  static componentName = 'Menu';
  protected template = template;
  protected override events = {
    click: (e: Event) => this.clickMenu(e)
  };

  private clickMenu(e: Event) {
    const menuId = (e.target as HTMLElement)?.dataset.menuid;
    if (menuId == undefined) {
      return;
    }

    e.stopPropagation();
    this.props.onClick(+menuId);
  }
}
