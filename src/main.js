import NewWayFilterView from './view/filters-view.js';
import NewInfoView from './view/info-container-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';
import MockService from './mock/service-mock.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { RenderPosition } from './render.js';
import { render } from './framework/render.js';

const body = document.querySelector('body');//боди
const header = body.querySelector('.page-header');//хедер
const tripInfoElement = header.querySelector('.trip-main');//секция инфо
const siteFilterElement = tripInfoElement.querySelector('.trip-controls__filters');//секция фильтров
const siteMainElement = document.querySelector('.page-main');//блок майн
const eventListElement = siteMainElement.querySelector('.trip-events');//секция списка путешествий

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointModel = new PointModel(mockService);

const boardPresenter = new BoardPresenter({
  container:eventListElement,
  destinationsModel,
  offersModel,
  pointModel,
});

render(new NewWayFilterView(), siteFilterElement);
render(new NewInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();

