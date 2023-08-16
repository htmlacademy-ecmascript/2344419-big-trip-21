import { createElement } from '../render.js';
import { infoContainerTemplite } from '../template/info-container-template.js';


export default class NewInfoView{
  getTemplate(){
    return infoContainerTemplite();
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
