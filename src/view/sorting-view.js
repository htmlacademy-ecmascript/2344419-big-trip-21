//сортировка
import { createElement } from '../render.js';
import { createSortingTemplite } from '../template/sorting-template.js';

export default class NewSortingView{
  getTemplate(){
    return createSortingTemplite();
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
