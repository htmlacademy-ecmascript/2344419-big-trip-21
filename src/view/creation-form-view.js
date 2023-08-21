//форма создания и редакторования
import { createElement } from '../render.js';
import { createFormTemplite } from '../template/creation-form-template.js';
import { BLANK_POINT } from '../const.js';

export default class NewCreateFormView{
  constructor({point = BLANK_POINT, pointDestination, pointOffers}){
    this.point = point;
    this.pointDestination = pointDestination;
    this.pointOffers = pointOffers;
  }

  getTemplate(){
    return createFormTemplite({
      point: this.point,
      pointDestination: this.pointDestination,
      pointOffers:this.pointOffers,
    });

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
