import {render, replace, remove} from '../framework/render.js';
import CreateFormView from '../view/creation-form-view.js';//форма редактирования
import WayPointView from '../view/waypoints-view.js';// один маршрут
import {Mode} from '.../const.js';

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
    this. #handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new WayPointView({//создаем точку
      point:this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick:this.#handlefavoriteClick,
    });
    this.#pointEditComponent = new CreateFormView({//форма редактирования
      point:this.#point,
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onFormSubmit:this.#handleFormSubmit,//сохранение
      onArrowUpClick:this.#handleEditClick,//переключение стрелка
      onDeleteClick:this.#handleDeleteClick,//удаление
    });

    if(prevPointComponent === null || prevPointEditComponent === null){
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

  resetView = () => {//очищаем
    if(this.#mode !== Mode.DEFAULT){
      this.#replaceFormToPoint();
    }
  };

  destroy = () =>{//удаляем
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm(){
    replace(this.#pointEditComponent,this.#pointComponent);//скрываем точку открываем форму
    document.addEventListener('keydown',this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint(){
    replace(this.#pointComponent,this.#pointEditComponent);//скрываем форму редактирования открываем точку
    document.removeEventListener('keydown',this.#escKeyDownHandler);//удаляем обработчик
    this.#mode = Mode.DEFAULT;
  }


  #escKeyDownHandler = (evt)=>{
    if(evt.key === 'Escape'){//проверяем какая клавиша нажата
      evt.preventDefault();//отменяем депйствия по умолчанию
      this.#replaceFormToPoint();//скрываем форму редактирования открываем точку
      document.removeEventListener('keydown',this.#escKeyDownHandler);//удаляем обрабокчик
    }
  };


  #handleEditClick = ()=>()=>{//обработчик клика по стрелке
    this.#replacePointToForm();//скрываем точку открываем форму
  };

  #handleFormSubmit = (point)=>{
    this.#replaceFormToPoint();//скрываем форму редактирования открываем точку
    this.#handleDataChange(point);
  };

  #handleDeleteClick = () =>{
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#pointEditComponent);
  };


  #handlefavoriteClick = () =>{
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };
}


