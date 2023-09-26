//форма создания и редакторования

import { createFormTemplite } from '../template/creation-form-template.js';
import { BLANK_POINT } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class CreateFormView extends AbstractStatefulView{
  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleArrowUpClick = null;
  #handleDeleteClick = null;
  #datepickerTo = null;
  #datepickerFrom = null;

  constructor({point = BLANK_POINT, pointDestinations, pointOffers,
    onFormSubmit, onArrowUpClick, onDeleteClick}){
    super();
    this._setState(CreateFormView.parsePointToState({point}));
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;//функция сохранения формы
    this.#handleArrowUpClick = onArrowUpClick;//закрытие формы
    this.#handleDeleteClick = onDeleteClick;//удаление
    this._restoreHandlers();
  }

  get template(){
    const isEditForm = this.#handleDeleteClick;
    return createFormTemplite({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers:this.#pointOffers,
      isEditForm
    });
  }

  removeElement(){
    super.removeElement();
    if(this.#datepickerTo){
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
    if(this.#datepickerFrom){
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
  }

  reset(point){
    this.updateElement(CreateFormView.parsePointToState(point));
  }

  _restoreHandlers = () =>{
    const availableOffersElement = this.element.querySelector('.event__available-offers');
    const resetButtonElement = this.element.querySelector('.event__reset-btn');

    this.element.querySelector('form')//кнопка сохранения
      .addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change',this.#priceChangeHandler);//изменить цену
    this.element.querySelector('.event__type-group')
      .addEventListener('change',this.#typeChangeHandler);//сменить тип точки
    this.element.querySelector('.event__input--destination')
      .addEventListener('change',this.#destinationChangeHandler);//сменить направлени

    if (availableOffersElement) {
      availableOffersElement.addEventListener('click', this.#offersChangeHandler);
    }

    if (this.#handleDeleteClick) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formArrowUpHandler);
      resetButtonElement.addEventListener('click', this.#deleteClickHandler);
    } else {
      resetButtonElement.addEventListener('click', this.#formSubmitHandler);
    }

    this.#setDatepickers();
  };


  #typeChangeHandler = (evt) =>{//перерисовка оферов по выбранному типу
    evt.preventDefault();
    this.updateElement({
      point:{
        ...this._state.point,
        newPointType:evt.target.value,
        offers:[]
      }
    });
  };

  #destinationChangeHandler = (evt) =>{//выбранное направление
    const selectedDistination = this.#pointDestinations.find((elem) => elem.name === evt.target.value);
    const selectedDistinationId = (selectedDistination) ? selectedDistination.id : null;

    this.updateElement({
      point:{
        ...this._state.point,
        destination:selectedDistinationId
      }
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.event__offer-selector')) {
      return;
    }

    const clickedOfferElement = evt.target.closest('.event__offer-selector').querySelector('input');
    const clickedOfferId = clickedOfferElement.dataset.offerId;
    let selectedOffers = this._state.offers;

    evt.target.closest('.event__offer-selector').querySelector('input').toggleAttribute('checked');

    if (clickedOfferElement.checked) {
      selectedOffers.push(clickedOfferId);
    } else {
      if (selectedOffers.length === 1) {
        selectedOffers = [];
      } else {
        selectedOffers = selectedOffers.filter((id) => id !== clickedOfferId);
      }
    }

    this.updateElement({
      offers: selectedOffers,
    });
  };

  #priceChangeHandler = (evt) =>{
    this._setState({
      point:{
        ...this._state.point,
        basePrice:Number(evt.target.value)
      }
    });
  };

  #dateFromCloseHandler = ([userDate]) => {//начало
    this._setState({
      point:{
        ...this._state.point,
        dateFrom:userDate
      }});
    this.#datepickerTo.set('minDate',this._state.point.dataFrom);
  };

  #dateToCloseHandler = ([userDate]) =>{//конец
    this._setState({
      point:{
        ...this._state.point,
        dateTo:userDate
      }
    });
    this.#datepickerFrom.set('maxDate',this._state.point.dateTo);
  };

  #setDatepickers = () =>{
    const dateFromElement = this.element.querySelector('#event-start-time-1');
    const dateToElement = this.element.querySelector('#event-end-time-1');
    const commonConfig = {//заготовка
      dateFormat: 'd/m/y H:i',//формат
      enableTime:true,//можно выбирать время
      locale:{
        firstDayOfWeek:1,//первый день недели понедельник
      },
      'time_24hr':true// формат 24 часа
    };
    this.#datepickerFrom = flatpickr(
      dateFromElement,{//дата начала
        ...commonConfig,
        defaultDate:this._state.point.dataFrom,
        onClose:this.#dateFromCloseHandler,
        maxDate:this._state.point.dateTo,
      },
    );
    this.#datepickerTo = flatpickr(
      dateToElement,{//дата конца
        ...commonConfig,
        defaultDate:this._state.point.dataTo,
        onClose:this.#dateToCloseHandler,
        maxDate:this._state.point.dataFrom,
      }
    );
  };

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(CreateFormView.parseStateToPint(this._state));//вызов функции сохранения
  };

  #formArrowUpHandler = (evt) =>{
    evt.preventDefault();
    this.#handleArrowUpClick();//вызов функции закрытия
  };

  #deleteClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleDeleteClick(this._state.point);//удаление
  };

  static parsePointToState(point){
    return{
      point,
      newPointType: false,
      newDestination: false,
      isDisabled : false,
      isSaving : false,
      isDeletind : false,};
  }

  static parseStateToPint = (state) => {
    const point = {...state};

    if (point.newPointType !== false) {
      point.type = point.newPointType;
    }

    if (point.newDestination !== false) {
      point.destination = point.newDestination;
    }

    delete point.newPointType;
    delete point.newDestination;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
