import {render, replace, remove} from '../framework/render.js';
import CreateFormView from '../view/creation-form-view.js';//форма редактирования
import WayPointView from '../view/waypoints-view.js';// один маршрут
import {Mode, WAYPOINT_TYPE} from '../const.js';
import { UserAction, UpdateType } from '../const.js';
import { isDateEqual } from '../utils/utils-sort.js';

export default class PointPresenter{
  #container = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #offersModel = null;
  #destinationsModel = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({container, offersModel, destinationsModel, onDataChange, onModeChange}){
    this.#container = container;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new WayPointView({//создаем точку
      point:this.#point,
      pointDestination: this.#destinationsModel.pointDestinations,
      pointOffers: this.#offersModel.offers,
      onEditClick: this.#handleEditClick,//стрелка
      onFavoriteClick:this.#handlefavoriteClick,//звезда
    });
    this.#pointEditComponent = new CreateFormView({//форма редактирования
      point:this.#point,
      pointTypes: WAYPOINT_TYPE,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onFormSubmit:this.#handleFormSubmit,//сохранение
      onArrowUpClick:this.#handleArrowUpClick,//переключение стрелка
      onDeleteClick:this.#handleDeleteClick,//удаление
    });

    if(prevPointComponent === null || prevPointEditComponent === null){//если первый раз
      render(this.#pointComponent, this.#container);
      return;
    }
    if (this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING){
      replace(this.#pointEditComponent,prevPointEditComponent);
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {//закрываем предыдущую форму
    if(this.#mode !== Mode.DEFAULT){
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  destroy = () =>{//удаляем
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent,this.#pointComponent);//скрываем точку открываем форму
    document.addEventListener('keydown',this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent,this.#pointEditComponent);//скрываем форму редактирования открываем точку
    document.removeEventListener('keydown',this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };


  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape'){//проверяем какая клавиша нажата
      evt.preventDefault();//отменяем депйствия по умолчанию
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();//скрываем форму редактирования открываем точку
    }
  };

  #handleArrowUpClick = () =>{//обработчик клика по стрелке вверх
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();//скрываем форму редактирования открываем точку
  };

  #handleEditClick = () => {//обработчик клика по стрелке вниз
    this.#replacePointToForm();//скрываем точку открываем форму
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !isDateEqual(this.#point.dateFrom, update.dateFrom);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToPoint();//скрываем форму редактирования открываем точку
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };


  #handlefavoriteClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };
}


