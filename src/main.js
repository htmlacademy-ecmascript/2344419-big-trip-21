import NewWayFilterView from './view/filters-view.js';
import NewInfoView from './view/info-container-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';

import { RenderPosition, render } from './render.js';

const body = document.querySelector('body');//боди
const header = body.querySelector('.page-header');//хедер
const siteMainelement = header.querySelector('.trip-main');//секция инфо
const siteFilterElement = siteMainelement.querySelector('.trip-controls__filters');//секция фильтров
const siteMainElement = document.querySelector('.page-main');//блок майн
const eventListElement = siteMainElement.querySelector('.trip-events');//секция списка путешествий

const pointModel = new PointModel;
const boardPresenter = new BoardPresenter({
  container:eventListElement,pointModel
});

render(new NewWayFilterView(), siteFilterElement);
render(new NewInfoView(), siteMainelement, RenderPosition.AFTERBEGIN);

boardPresenter.init();

