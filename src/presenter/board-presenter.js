import SortingView from '../view/sorting-view.js';//сортировка
import EventListView from '../view/event-list-view.js';//список
import NoPointView from '../view/no-point-view.js';//заглушка
import LoadingView from '../view/loading-view.js';//загрузка
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, FilterType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import {filter} from '../utils/utils-filter.js';
import { getPointsDateDifference, getPointsTimeDifference, getPointsPriceDifference} from '../utils/utils-sort.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #offersModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #mockService = null;
  #sortComponent = null;
  #newFilterPresenter = null;
  #eventListComponent = new EventListView();
  #noPointComponent = null;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit:TimeLimit.LOWER_LIMIT,
    upperLimit:TimeLimit.UPPER_LIMIT
  });

  __isMessageRemoved = false;
  #isServerAvailable = true;
  #isLoading = true;
  #handleNewPointButtonDisable = null;
  #handleNewPointButtonUnlock = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointPresenters = new Map();//ассоциативный массив
  #newPointPresenter = null;

  constructor({container, pointModel, offersModel, filterModel, destinationsModel, mockService, onNewPointButtonDisable, onNewPointButtonUnblock}){
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#mockService = mockService;
    this.#handleNewPointButtonDisable = onNewPointButtonDisable;
    this.#handleNewPointButtonUnlock = onNewPointButtonUnblock;

    const filtersElement = document.querySelector('.trip-controls__filters');
    render(this.#eventListComponent, this.#container);

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
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


    this.#mockService.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points(){
    const points = this.#pointModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType](points);//фильтрация

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

  createPoint() {//создание точки
    this.#currentSortType = SortType.DAY;
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
      case UserAction.UPDATE_POINT://изменение
        this.#pointPresenters.get(update.id).setSaving();
        try{
          await this.#mockService.updatePoint(updateType, update);
        } catch{
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT://добавление
        this.#pointPresenters.setSaving();
        try{
          await this.#mockService.addPoint(updateType, update);
        } catch{
          this.#pointPresenters.setAborting();
        }
        break;

      case UserAction.DELETE_POINT://удаление
        this.#pointPresenters.get(update.id).setDeleting();
        try{
          await this.#mockService.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () =>{//закрываем форму при открытии другой
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleSortTypeChange = (item)=>{
    if (this.#currentSortType === item) {
      return;
    }
    this.#currentSortType = item;//сортируем
    this.#clearPoints();//очищаем
    this.#renderSort();//рендерим сортировку
    this.#renderPoints();//рендерим список заново
  };

  #renderSort = () => {//отрисовка сортировки
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortingView({
      items: Array.from(Object.keys(SortType)),
      onItemChange: this.#handleSortTypeChange,
    });
    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#container);
      return;
    }
    replace(this.#sortComponent, prevSortComponent);
  };

  #renderPoints = () => {//отрисовка коллекции точек
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #renderPoint = (point) => {//отрисовка  одной точки
    const pointPresenter = new PointPresenter({
      container:this.#eventListComponent.element,
      destinationsModel:this.#destinationsModel,
      offersModel:this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderBoard = () => {
    this.#isServerAvailable = Boolean(this.points);
    this.#newFilterPresenter.init();
    if (this.#isLoading) {
      this.#renderLoading();
      this.#handleNewPointButtonDisable();
      return;
    }
    if (!this.#isServerAvailable || this.points.length === 0) {
      this.#handleNewPointButtonUnlock();
      this.#renderNoPoint(this.#isServerAvailable);
      return;
    }

    this.#handleNewPointButtonUnlock();
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderPoints();
  };


  #clearPoints = ({resetSortType = false} = {}) =>{//удаление точек
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter)=>presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderNoPoint = (isServerAvailable) => {//отрисовка при отсутствии точек
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType,
      isServerAvailable
    });
    if(isServerAvailable){
      this.#handleNewPointButtonDisable();
    }
    render(this.#noPointComponent, this.#container);
  };
}
