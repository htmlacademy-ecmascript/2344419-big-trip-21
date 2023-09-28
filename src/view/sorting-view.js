//сортировка
import { createSortingTemplite } from '../template/sorting-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;
  #sortItems = [];

  constructor({ onItemChange, items }) {
    super();
    this.#sortItems = items;
    this.#handleSortTypeChange = onItemChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplite(this.#sortItems);
  }

  #sortTypeChangeHandler = (evt) => {

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortItems);
  };

}
