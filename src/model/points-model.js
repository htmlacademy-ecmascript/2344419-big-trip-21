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

  async addPoint(updateType, update) {
    await this.#service.addPoint(updateType, update);
  }

  async updatePoint(updateType, update) {
    await this.#service.updatePoint(updateType, update);
  }

  async deletePoint(updateType, update) {
    await this.#service.deletePoint(updateType, update);
  }
}
