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
    return createFormTemplite({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers:this.#pointOffers,
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
    this.updateElement({point});
  }

  _restoreHandlers = () =>{
    this.element.querySelector('form')//кнопка сохранения
      .addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')//стрелка
      .addEventListener('click',this.#formArrowUpHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);//удалить
    this.element.querySelector('.event__type-group')
      .addEventListener('change',this.#typeChangeHandler);//сменить тип точки
    this.element.querySelector('.event__input--destination')
      .addEventListener('change',this.#destinationChangeHandler);//сменить направление
    this.element.querySelector('.event__available-offers')
      .addEventListener('change',this.#offersChangeHandler);//выбрать офферы
    this.element.querySelector('.event__input--price')
      .addEventListener('change',this.#priceChangeHandler);//изменить цену
    this.#setDatepickers();
  };


  #typeChangeHandler = (evt) =>{//перерисовка оферов по выбранному типу
    this.updateElement({
      point:{
        ...this._state.point,
        type:evt.target.value,
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

  #offersChangeHandler = () =>{
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point:{
        ...this._state.point,
        offers:checkedBoxes.map((element) => element.dataset.offerId)
      }
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
    this.#handleDeleteClick();//удаление
  };

  static parsePointToState = ({point}) =>({point});

  static parseStateToPint = (state) => state.point;
}
