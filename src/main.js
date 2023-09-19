
import NewInfoView from './view/info-container-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointModel from './model/points-model.js';
import MockService from './mock/service-mock.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';

import { render , RenderPosition} from './framework/render.js';
import PointsApiService from './mock/points-api-service.js';

const AUTHORIZATION = 'Basic khkJ34dt777nj5343xcFkhd';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const body = document.querySelector('body');//боди
const header = body.querySelector('.page-header');//хедер
const tripInfoElement = header.querySelector('.trip-main');//секция инфо
const siteMainElement = document.querySelector('.page-main');//блок майн
const eventListElement = siteMainElement.querySelector('.trip-events');//секция списка путешествий
const filtersElement = header.querySelector('.trip-controls__filters');//фильтры

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const mockService = new MockService({pointsApiService});
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointModel = new PointModel(mockService);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container:eventListElement,
  destinationsModel,
  offersModel,
  pointModel,
  mockService,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  pointModel,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new NewInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
filterPresenter.init();
boardPresenter.init();
mockService.init().finally(() => {
  render(newPointButtonComponent, tripInfoElement);
});
