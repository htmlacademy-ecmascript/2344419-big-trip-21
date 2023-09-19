
import NewInfoView from './view/info-container-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointModel from './model/points-model.js';
import MockService from './mock/service-mock.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './service/points-api-service.js';

import { render , RenderPosition} from './framework/render.js';

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
const newPointButtonPresenter = new NewPointButtonPresenter({
  container:tripInfoElement,
});


const boardPresenter = new BoardPresenter({
  container:eventListElement,
  destinationsModel,
  offersModel,
  pointModel,
  filterModel,
  newPointButtonPresenter: NewPointButtonPresenter
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  pointModel,
});


render(new NewInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
newPointButtonPresenter.init({
  onButtonClick:boardPresenter.newPointButtonClickHandler
});

boardPresenter.init();
filterPresenter.init();
//mockService.init().finally(() => {
//  render(newPointButtonComponent, tripInfoElement);
//});
