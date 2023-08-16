//фильтры
import { createElement } from '../render.js';
import { createWayPointTemplite } from '../template/filters-template.js';


export default class NewFilterView{
  getTemplate(){
    return createWayPointTemplite();
  }

  getElement(){
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement(){
    this.element = null;
  }
}
