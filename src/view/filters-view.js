//фильтры
import { createWayPointTemplite } from '../template/filters-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class FilterView extends AbstractView{
  get template(){
    return createWayPointTemplite();
  }
}
