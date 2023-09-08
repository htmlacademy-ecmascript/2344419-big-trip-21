//сортировка
import { createSortingTemplite } from '../template/sorting-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class SortingView extends AbstractView{
  #hendleSortTypeChange = null;
  #items = [];

  constructor({items, onSortTypeChange}){
    super();
    this.#items = items;
    this.#hendleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click',this.#sortTypeChangeHandler);
  }

  get template(){
    return createSortingTemplite(this.#items);
  }

  #sortTypeChangeHandler = (evt)=>{
    if(evt.target.tagName !== 'A'){//проверяем клик
      return;
    }
    evt.preventDefault();
    this.#hendleSortTypeChange(evt.target.dataset.item);//передаем в обработчик тип сорт
  };

}
