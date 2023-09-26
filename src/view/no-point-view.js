import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createNoPointTemplite(filterType, isServerAvailable){
  const noPointTextValue = NoPointTextType[filterType];
  return isServerAvailable ? (
    `<p class="trip-events__msg">${noPointTextValue}</p>`)
    : '<p class="trip-events__msg">Failed to load latest route information</p>';
}

export default class NoPointView extends AbstractView{
  #filterType = null;
  #isServerAvailable = null;

  constructor({filterType, isServerAvailable}) {
    super();
    this.#filterType = filterType;
    this.#isServerAvailable = isServerAvailable;
  }

  get template() {
    return createNoPointTemplite(this.#filterType, this.#isServerAvailable);
  }
}
