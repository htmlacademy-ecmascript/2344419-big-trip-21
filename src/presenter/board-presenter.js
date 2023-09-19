import SortingView from '../view/sorting-view.js';//сортировка
import EventListView from '../view/event-list-view.js';//список
import NoPointView from '../view/no-point-view.js';//заглушка
import LoadingView from '../view/loading-view.js';//загрузка
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import {filter} from '../utils/utils-filter.js';
import { getPointsDateDifference, getPointsTimeDifference, getPointsPriceDifference} from '../utils/utils-sort.js';

export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #offersModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #mockService = null;

  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noPointComponent = null;
  #loadingComponent = new LoadingView();

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointPresenters = new Map();//ассоциативный массив
  #newPointPresenter = null;
  #isLoading = true;

  constructor({container, pointModel, offersModel, filterModel, destinationsModel, onNewPointDestroy, mockService}){
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#mockService = mockService;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
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
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT://изменение
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT://добавление
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT://удаление
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
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
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#container);

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }
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

  #renderNoPoint = () => {//отрисовка при отсутствии точек
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#container);
  };
}
