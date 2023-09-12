//сортировка
import { createSortingTemplite } from '../template/sorting-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class SortingView extends AbstractView{
  #handleSortTypeChange = null;
  #items = [];

  constructor({items, onItemChange}){
    super();
    this.#items = items;
    this.#handleSortTypeChange = onItemChange;
    this.element.addEventListener('change',this.#sortTypeChangeHandler);
  }

  get template(){
    return createSortingTemplite(this.#items);
  }

  #sortTypeChangeHandler = (evt)=>{
    // if(evt.target.tagName === 'A'){//проверяем клик
    //   return;
    // }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.item);//передаем в обработчик тип сорт
  };

}
