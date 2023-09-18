import Observable from '../framework/observable';
import { FilterType } from '../const';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;//возв текущий фильтр
  }

  setFilter(updateType, filter) {//обновление
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
