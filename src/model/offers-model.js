export default class OffersModel {
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get offers() {
    return this.#service.offers;
  }
}
