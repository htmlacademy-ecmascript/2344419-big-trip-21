import dayjs from 'dayjs';
import InfoView from '../view/info-container-view';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { getDestinationsById, getOffersByType, getCheckedOffers, sortPointsByDay } from '../utils/utils-trip-info.js';
import { DESTINATION_ITEMS_LENGTH } from '../const.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointModel = null;
  #serviceData = null;
  #tripInfoComponent = null;
  #sortedPoints = null;

  constructor({ tripInfoContainer, offersModel, destinationsModel, pointModel, serviceData }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointModel = pointModel;
    this.#serviceData = serviceData;

    this.#serviceData.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (this.#pointModel.points && this.#pointModel.points.length) {
      this.#sortedPoints = this.#pointModel.points.sort(sortPointsByDay);
      this.#tripInfoComponent = new InfoView(this.#getTripTitle(), this.#getTripDuration(), this.#getTotalTripCost());

      if (prevTripInfoComponent === null) {
        render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
        return;
      }

      replace(this.#tripInfoComponent, prevTripInfoComponent);
      remove(prevTripInfoComponent);
    } else {
      this.#tripInfoComponent = new InfoView();
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      remove(prevTripInfoComponent);
    }
  }

  #getTripTitle() {
    const destinations = this.#destinationsModel.destinations;
    const destinationNames = this.#sortedPoints.map((point) => getDestinationsById(point.destination, destinations).name);

    return destinationNames.length <= DESTINATION_ITEMS_LENGTH ? destinationNames.join('&nbsp;&mdash;&nbsp;')
      : `${destinationNames.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.at(-1)}`;
  }

  #getTripDuration() {
    return `${(dayjs(this.#sortedPoints.at(0).dateFrom).format('DD MMM'))
      .toString()}&nbsp;&mdash;&nbsp;${(dayjs(this.#sortedPoints.at(-1).dateTo).format('DD MMM')).toString()}`;
  }

  #getTotalTripCost() {
    let offers = null;
    let price = 0;
    let offersPrice = 0;

    this.#sortedPoints.forEach((point) => {
      offers = getCheckedOffers(point.offers, getOffersByType(point.type, this.#offersModel.offers));
      offers.forEach((offer) => {
        offersPrice += offer.price;
      });
      price += point.basePrice;
    });
    price += offersPrice;

    return price.toString();
  }

  #handleModelEvent = () => {
    this.init();
  };
}
