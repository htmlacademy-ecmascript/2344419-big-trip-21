import FilterView from '../view/filters-view.js';
import { filter } from '../utils/utils-filter.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointModel = null;
  #filters = [];

  constructor({container,pointsModel: pointModel}){
    this.#container = container;
    this.#pointModel = pointModel;

    this.#filters = Object.entries(filter)
      .map(([filterType,filterPoints],index)=>({
        type:filterType,
        isChecked:index === 0,
        isDisabled:filterPoints(this.#pointModel.get()).length === 0,
      }));
  }

  init(){
    render(new FilterView({ items:this.#filters }), this.#container);
  }
}
