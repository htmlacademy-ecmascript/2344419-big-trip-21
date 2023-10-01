//форма создания и редакторования

import { createFormTemplite } from '../template/creation-form-template.js';
import { BLANK_POINT } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { getDestinationByName } from '../utils/utils-trip-info.js';

export default class CreateFormView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleArrowUpClick = null;
  #handleDeleteClick = null;
  #handleCancelClick = null;

  #datepickerTo = null;
  #datepickerFrom = null;

  constructor({ point = BLANK_POINT, pointDestinations, pointOffers,
    onFormSubmit = null, onArrowUpClick = null, onDeleteClick = null, onCancelClick = null }) {
    super();
    this._setState(CreateFormView.parsePointToState({ point }));
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleArrowUpClick = onArrowUpClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCancelClick = onCancelClick;
    this._restoreHandlers();
  }

  get template() {
    const isEditForm = this.#handleDeleteClick;
    return createFormTemplite({
      state: this._state,
      destinations: this.#pointDestinations,
      offers: this.#pointOffers,
      isEditForm
    });
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
  }

  reset(point) {
    this.updateElement(CreateFormView.parsePointToState(point));
  }

  _restoreHandlers = () => {
    const availableOffersElement = this.element.querySelector('.event__available-offers');
    const resetButtonElement = this.element.querySelector('.event__reset-btn');

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('#event-price-1')
      .addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1')
      .addEventListener('change', this.#destinationChangeHandler);

    if (availableOffersElement) {
      availableOffersElement.addEventListener('click', this.#offersChangeHandler);
    }

    if (this.#handleDeleteClick) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formArrowUpHandler);
      resetButtonElement.addEventListener('click', this.#deleteClickHandler);
    } else {
      resetButtonElement.addEventListener('click', this.#formCancelHandler);
    }

    this.#setDatepickers();
  };


  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: [],
      point: {
        ...this._state.point,
        type: evt.target.value,
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        // destination: '',
        destination: evt.target.value ? getDestinationByName(evt.target.value, this.#pointDestinations).id : false,
      },
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.event__offer-selector')) {
      return;
    }

    const clickedOfferElement = evt.target.closest('.event__offer-selector').querySelector('input');
    const clickedOfferId = clickedOfferElement.dataset.offerId;
    let selectedOffers = this._state.point.offers;

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
      point: {
        ...this._state.point,
        offers: selectedOffers
      }
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        basePrice: Number(evt.target.value)
      }
    });
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dataFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers = () => {
    const dateFromElement = this.element.querySelector('#event-start-time-1');
    const dateToElement = this.element.querySelector('#event-end-time-1');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };
    this.#datepickerFrom = flatpickr(
      dateFromElement, {
      ...commonConfig,
      defaultDate: this._state.point.dataFrom,
      onClose: this.#dateFromCloseHandler,
      maxDate: this._state.point.dateTo,
    },
    );
    this.#datepickerTo = flatpickr(
      dateToElement, {
      ...commonConfig,
      defaultDate: this._state.point.dataTo,
      onClose: this.#dateToCloseHandler,
      maxDate: this._state.point.dataFrom,
    }
    );
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(CreateFormView.parseStateToPint(this._state));
  };

  #formCancelHandler = () => {
    this.#handleCancelClick();
  };


  #formArrowUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowUpClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(CreateFormView.parseStateToPint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      newPointType: false,
      newDestination: false,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPint = (state) => {
    const point = { ...state };

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
