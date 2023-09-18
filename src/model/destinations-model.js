import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable{
  #service = null;

  constructor(service) {
    super();
    this.#service = service;

  }

  get destination() {
    return this.#service.destinations;
  }
}
