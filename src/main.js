

import BoardPresenter from './presenter/board-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';

import TripInfoPresenter from './presenter/trip-info-presenter.js';

import ServiceData from './service/service-data.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';

import { render } from './framework/render.js';
import PointsApiService from './service/points-api-service.js';

const AUTHORIZATION = 'Basic eo0w590ik1989b';
const END_POINT = 'https://21.objects.pages.academy/big-trip';


const tripInfoElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const serviceData = new ServiceData({ pointsApiService });
const destinationsModel = new DestinationsModel(serviceData);
const offersModel = new OffersModel(serviceData);
const pointModel = new PointsModel(serviceData);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  destinationsModel,
  offersModel,
  pointModel,
  serviceData: serviceData,
  filterModel,
  onNewPointButtonDisable: handleNewPointButtonDisable,
  onNewPointButtonUnblock: handleNewPointButtonUnlock,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});
function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  handleNewPointButtonDisable();
}

function handleNewPointButtonDisable() {
  newPointButtonComponent.element.disabled = true;
}
function handleNewPointButtonUnlock() {
  newPointButtonComponent.element.disabled = false;
}

new TripInfoPresenter({
  tripInfoContainer: tripInfoElement,
  offersModel,
  destinationsModel,
  pointModel,
  serviceData: serviceData,
});

boardPresenter.init();
render(newPointButtonComponent, tripInfoElement);
serviceData.init();

