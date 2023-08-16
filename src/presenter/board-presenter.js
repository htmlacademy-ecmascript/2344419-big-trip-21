import NewSortingView from '../view/sorting-view.js';//сортировка
import NewCreateFormView from '../view/creation-form-view.js';//форма редактирования
import NewWayPointView from '../view/waypoints-view.js';// один маршрут
import NewEventListView from '../view/event-list-view.js';//список

import { render } from '../render.js';

export default class BoardPresenter {
  sortComponent = new NewSortingView();
  eventListComponent = new NewEventListView();

  constructor({container,pointModel}){
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {//отрисовывается
    this.boardPoint = [...this.pointModel.getPoint()];
    render(this.sortComponent, this.container);//сортировка
    render(this.eventListComponent, this.container);//список

    render(new NewCreateFormView(), this.eventListComponent.getElement());
    for (let i = 0; i < this.boardPoint.length; i++){//три маршрута
      render(new NewWayPointView({point:this.boardPoint[i]}),this.eventListComponent.getElement());
    }
  }
}
