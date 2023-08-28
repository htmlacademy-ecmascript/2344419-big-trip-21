//форма создания и редакторования

import { createFormTemplite } from '../template/creation-form-template.js';
import { BLANK_POINT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class CreateFormView extends AbstractView{
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;


  constructor({point = BLANK_POINT, pointDestination, pointOffers, onFormSubmit, onCloseClick}){
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;//функция сохранения формы
    this.#handleCloseClick = onCloseClick;//закрытие формы

    this.element.querySelector('.event__save-btn')//кнопка сохранения
      .addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')//кнопка очистить
      .addEventListener('click',this.#formCancelHandler);
  }

  get template(){
    return createFormTemplite({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffers:this.#pointOffers,
    });
  }

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();//отмена действий по умолчанию
    this.#handleFormSubmit();//вызов функции сохранения
  };

  #formCancelHandler = (evt) =>{
    evt.preventDefault();//отмена действий по умолчанию
    this.#handleCloseClick();//вызов функции закрытия
  };
}
