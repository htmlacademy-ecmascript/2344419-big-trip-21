
import { infoContainerTemplite } from '../template/info-container-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class InfoView extends AbstractView{
  #tripInfoDestinations = null;
  #tripInfoDate = null;
  #price = null;

  constructor(tripInfoDestinations = '', tripInfoDate = '', price = '') {
    super();
    this.#tripInfoDestinations = tripInfoDestinations;
    this.#tripInfoDate = tripInfoDate;
    this.#price = price;
  }

  get template(){
    return infoContainerTemplite(
      this.#tripInfoDestinations,
      this.#tripInfoDate,
      this.#price,
    );
  }
}
