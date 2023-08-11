import NewWayFilterView from './view/filters.js';
import NewSortingView from './view/sorting.js';
import NewCreateFormView from './view/creation-form.js';
import NewWayPointView from './view/waypoints.js';
import NewInfoView from './view/info-container.js';

import { RenderPosition, render } from './render.js';

const POINT_COUNT = 3;
const siteMainElement = document.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');
const siteMainelement = document.querySelector('.trip-main');
const siteFilterElement = siteMainelement.querySelector('.trip-controls__filters');

render(new NewWayFilterView(), siteFilterElement);

render(new NewInfoView(), siteMainelement, RenderPosition.AFTERBEGIN);

render(new NewSortingView(), eventListElement);//сортировка
render(new NewCreateFormView(), eventListElement);//форма редактирования
for(let i = 0; i < POINT_COUNT; i++){
  render(new NewWayPointView(), eventListElement);//точка маршрута
}


