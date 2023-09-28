import { remove, render, RenderPosition } from '../framework/render.js';
import CreateFormView from '../view/creation-form-view.js';
import { UserAction, UpdateType, WAYPOINT_TYPE } from '../const.js';


export default class NewPointPresenter {
  #container = null;
  #destinationModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleEditFormClose = null;
  #handleDestroy = null;
  #pointEditComponent = null;

  constructor({ container, destinationModel, offersModel, onDataChange, onDestroy, onEditFormClose }) {
    this.#container = container;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleEditFormClose = onEditFormClose;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new CreateFormView({
      pointTypes: WAYPOINT_TYPE,
      pointDestinations: this.#destinationModel.destinations,
      pointOffers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });
    render(this.#pointEditComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    this.#handleEditFormClose();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
