//точки маршрута
import { createElement } from '../render.js';
import { createWayPointTemplite } from '../template/waypoints-template.js';


export default class NewWayPointView{
  constructor({point, pointDestination, pointOffers}){
    this.point = point;
    this.pointDestination = pointDestination;
    this.pointOffers = pointOffers;
  }

  getTemplate(){
    return createWayPointTemplite({
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
