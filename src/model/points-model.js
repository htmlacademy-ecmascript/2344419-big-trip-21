import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #service = null;

  constructor(service) {
    super();
    this.#service = service;
  }

  get points() {
    return this.#service.getPoints();
  }
}
