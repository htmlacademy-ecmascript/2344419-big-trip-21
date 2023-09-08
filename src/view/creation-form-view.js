//форма создания и редакторования

import { createFormTemplite } from '../template/creation-form-template.js';
import { BLANK_POINT } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';


export default class CreateFormView extends AbstractStatefulView{
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleArrowUpClick = null;
  #handleDeleteClick = null;

  constructor({point = BLANK_POINT, pointDestination, pointOffers, onFormSubmit, onArrowUpClick, onDeleteClick}){
    super();
    this._setState(CreateFormView.parsePointToState({point}));
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;//функция сохранения формы
    this.#handleArrowUpClick = onArrowUpClick;//закрытие формы
    this.#handleDeleteClick = onDeleteClick;//удаление
    this._restoreHandlers();
  }

  _restoreHandlers = () =>{
    this.element.querySelector('.event__save-btn')//кнопка сохранения
      .addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')//стрелка
      .addEventListener('click',this.#formArrowUpHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);//удалить

  };

  get template(){
    return createFormTemplite({
      state: this._state,
      pointDestination: this.#pointDestination,
      pointOffers:this.#pointOffers,
    });
  }

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();//отмена действий по умолчанию
    this.#handleFormSubmit();//вызов функции сохранения
  };

  #formArrowUpHandler = (evt) =>{
    evt.preventDefault();//отмена действий по умолчанию
    this.#handleArrowUpClick();//вызов функции закрытия
  };

  #deleteClickHandler = (evt) =>{
    evt.preventDefault();//отмена действий по умолчанию
    this.#handleDeleteClick();//удаление
  };

  static parsePointToState = ({point}) =>({point});

  static parseStateToPint = (state) => state.point;
}
