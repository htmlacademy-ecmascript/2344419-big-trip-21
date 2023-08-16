//форма создания и редакторования
import { createElement } from '../render.js';
import { createFormTemplite } from '../template/creation-form-template.js';


export default class NewCreateFormView{
  getTemplate(){
    return createFormTemplite();
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
