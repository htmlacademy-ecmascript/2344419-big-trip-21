import AbstractView from '../framework/view/abstract-view.js';

function createAddButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleNewPointButtonClick = null;

  constructor({onClick}) {
    super();
    this.#handleNewPointButtonClick = onClick;
    this.element.addEventListener('click', this.#newPointButtonClickHandler);
  }

  get template() {
    return createAddButtonTemplate();
  }

  setDisabled = (isDisabled) => {
    this.element.disabled = isDisabled;
  };

  #newPointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewPointButtonClick();
  };
}
