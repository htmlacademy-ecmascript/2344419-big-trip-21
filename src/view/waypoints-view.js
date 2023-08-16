//точки маршрута
import { createElement } from '../render.js';
import { createWayPointTemplite } from '../template/waypoints-template.js';


export default class NewWayPointView{
  constructor({point}){
    this.point = point;
  }

  getTemplate(){
    return createWayPointTemplite(this.point);
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
