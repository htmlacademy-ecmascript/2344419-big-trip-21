import NewSortingView from '../view/sorting-view.js';//сортировка
import NewCreateFormView from '../view/creation-form-view.js';//форма редактирования
import NewWayPointView from '../view/waypoints-view.js';// один маршрут
import NewEventListView from '../view/event-list-view.js';//список

import { render } from '../render.js';

export default class BoardPresenter {
  eventListComponent = new NewEventListView();
  sortComponent = new NewSortingView();

  constructor({container, pointModel, offersModel, destinationsModel}){
    this.container = container;
    this.pointModel = pointModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
    this.points = [...pointModel.get()];
  }

  init() {//отрисовывается
    render(this.sortComponent, this.container);//сортировка
    render(this.eventListComponent, this.container);//список
    render(new NewCreateFormView({
      point:this.points[0],
      pointDestination: this.destinationsModel.get(),
      pointOffer: this.offersModel.get()
    }),
    this.eventListComponent.getElement());


    this.points.forEach((point) => {
      render(
        new NewWayPointView({
          point,
          pointDestination: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }),
        this.eventListComponent.getElement()
      );
    });
  }
}

