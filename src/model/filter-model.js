import Observable from '../framework/observable';
import { FilterType } from '../const';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get() {
    return this.#filter;//возв текущий фильтр
  }

  setFilter(updateType, update) {//обновление
    this.#filter = update;
    this._notify(updateType, update);
  }
}
