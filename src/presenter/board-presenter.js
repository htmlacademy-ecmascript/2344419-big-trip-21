import SortingView from '../view/sorting-view.js';//сортировка
import EventListView from '../view/event-list-view.js';//список
import NoPointView from '../view/no-point-view.js';//заглушка
import PointPresenter from './point-presenter.js';
import { sort } from '../utils/utils-sort.js';
import { updateItem } from '../utils/utils.js';
import { sortType, enabledSortType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class BoardPresenter {
  #container = null;
  #sortComponent = null;
  #eventListComponent = null;
  #pointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #currentSortType = sortType.DAY;

  #pointPresenters = new Map();
  #noPointComponent = new NoPointView();

  constructor({container, pointModel, offersModel, destinationsModel}){
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#points = sort[sortType.DAY]([...this.#pointModel.get()]);
  }


  init() {
    this.#renderBoard();
  }

  #renderPoint(point){//отрисовка  одной точки
    const pointPresenter = new PointPresenter({
      container:this.#eventListComponent.element,
      destinationsModel:this.#destinationsModel,
      offersModel:this.#offersModel,
      onDataChange:this.#pointChangeHandler,
      onModeChange:this.#modeChangeHandler,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #sortPoints = (inSortType)=>{///////////////////////////////////////////
    this.#currentSortType = inSortType;//////////////////////////////////////
    this.#points = sort[this.#currentSortType](this.#points);///////////////////////////
  };

  #renderBoard(){
    if (this.#points.length === 0){
      render(this.#renderNoPoint, this.#container);//заглушка
      return;
    }
    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  }

  #renderPoints = () =>{//отрисовка коллекции точек
    this.#points.forEach((point)=>{
      this.#renderPoint(point);
    });
  };

  #clearPoints = () =>{//удаление точек
    this.#pointPresenters.forEach((presenter)=>presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderNoPoint(){//отрисовка при отсутствии точек
    render(this.#noPointComponent, this.#container);
  }

  #renderSort(){//отрисовка сортировки
    const prevSortComponent = this.#sortComponent;
    const sortTypes = Object.values(sortType).map((type)=>({
      type,
      isChecked:(type === this.#currentSortType),
      isDisabled:!enabledSortType[type]
    }));
    this.#sortComponent = new SortingView({
      items:sortTypes,
      onItemChange:this.#sortTypeChangeHandler
    });
    if (prevSortComponent){
      replace(this.#sortComponent,prevSortComponent);
      remove(prevSortComponent);
    } else{
      render(this.#sortComponent,this.container);
    }
  }

  #renderPointContainer = () => {
    this.#eventListComponent = new EventListView();
    render (this.#eventListComponent,this.#container);
  };


  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTypeChangeHandler = (SortType)=>{

    this.#sortPoints(SortType);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };

  #modeChangeHandler = () =>{
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

}

