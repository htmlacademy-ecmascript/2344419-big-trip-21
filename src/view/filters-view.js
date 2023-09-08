//фильтры
import { createWayPointTemplite } from '../template/filters-template.js';
import RadioListView from './radio-list-view.js';


export default class FilterView extends RadioListView{

  get template(){
    return createWayPointTemplite(this._items);
  }
}
