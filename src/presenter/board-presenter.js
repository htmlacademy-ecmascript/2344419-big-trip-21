import SortingView from '../view/sorting-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, FilterType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import { filter } from '../utils/utils-filter.js';
import { getPointsDateDifference, getPointsTimeDifference, getPointsPriceDifference } from '../utils/utils-sort.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #offersModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #serviceData = null;
  #sortComponent = null;
  #newFilterPresenter = null;
  #newPointPresenter = null;
  #eventListComponent = new EventListView();
  #noPointComponent = null;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  __isMessageRemoved = false;
  #isServerAvailable = true;
  #isLoading = true;
  #handleNewPointButtonDisable = null;
  #handleNewPointButtonUnlock = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointPresenters = new Map();

  constructor({ container, pointModel, offersModel, filterModel, destinationsModel, serviceData, onNewPointButtonDisable, onNewPointButtonUnblock }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#serviceData = serviceData;
    this.#handleNewPointButtonDisable = onNewPointButtonDisable;
    this.#handleNewPointButtonUnlock = onNewPointButtonUnblock;

    const filtersElement = document.querySelector('.trip-controls__filters');
    render(this.#eventListComponent, this.#container);

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointButtonUnlock,
      onEditFormClose: this._editFormCloseHandler,
    });

    this.#newFilterPresenter = new FilterPresenter({
      filterContainer: filtersElement,
      filterModel,
      pointModel,
    });


    this.#serviceData.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    if (!points) {
      return [];
    }
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.toSorted(getPointsDateDifference);
      case SortType.TIME:
        return filteredPoints.toSorted(getPointsTimeDifference);
      case SortType.PRICE:
        return filteredPoints.toSorted(getPointsPriceDifference);
    }

    return filteredPoints;
  }


  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterType = FilterType.EVERYTHING;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();

    if (this.#noPointComponent) {
      this._isMessageRemoved = true;
      remove(this.#noPointComponent);
    }
  }

  _editFormCloseHandler = () => {
    if (this._isMessageRemoved) {
      this.#renderNoPoint(true);
      this._isMessageRemoved = false;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:

        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#clearPoints();
        this.#renderBoard();
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleSortTypeChange = (item) => {
    if (this.#currentSortType === item) {
      return;
    }

    this.#currentSortType = item;
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortingView({
      items: Array.from(Object.values(SortType)),
      onItemChange: this.#handleSortTypeChange,
    });
    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#container);
      return;
    }
    replace(this.#sortComponent, prevSortComponent);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderBoard = () => {
    this.#isServerAvailable = this.#serviceData.getDestinations();
    this.#newFilterPresenter.init();
    if (this.#isLoading) {
      this.#renderLoading();
      this.#handleNewPointButtonDisable();
      return;
    }
    if (!this.#isServerAvailable) {
      this.#handleNewPointButtonUnlock();
      this.#renderNoPoint(false);
      return;
    }
    if (this.points.length === 0) {
      this.#handleNewPointButtonUnlock();
      this.#renderNoPoint(true);
      return;
    }

    this.#handleNewPointButtonUnlock();
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderPoints();
  };


  #clearPoints = ({ resetSortType = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderNoPoint = (isServerAvailable) => {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType,
      isServerAvailable
    });
    if (!isServerAvailable) {
      this.#handleNewPointButtonDisable();
    }
    render(this.#noPointComponent, this.#container);
  };
}
