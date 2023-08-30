//фильтры
import { createWayPointTemplite } from '../template/filters-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class FilterView extends AbstractView{
  #filters = null;

  constructor({filters}){
    super();
    this.#filters = filters;
  }

  get template(){
    return createWayPointTemplite(this.#filters);
  }
}
