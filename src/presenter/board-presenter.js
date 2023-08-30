import SortingView from '../view/sorting-view.js';//сортировка
import CreateFormView from '../view/creation-form-view.js';//форма редактирования
import WayPointView from '../view/waypoints-view.js';// один маршрут
import EventListView from '../view/event-list-view.js';//список
import NoPointView from '../view/no-point-view.js';//заглушка

import { render, replace } from '../framework/render.js';

export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];

  #eventListComponent = new EventListView();
  #sortComponent = new SortingView();

  constructor({container, pointModel, offersModel, destinationsModel}){
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#points = [...this.#pointModel.get()];
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard(){
    render(this.#sortComponent, this.#container);//сортировка
    render(this.#eventListComponent, this.#container);//список
    this.#renderPointsList();//точки
  }

  #renderPointsList() {
    if (this.#points.length) {
      this.#points.forEach((point) => {
        this.#renderPoint(point);
      });
    } else {
      render(new NoPointView(), this.#container);
    }
  }


  #renderPoint(point){//отрисовка точки
    const escKeyDownHandler = (evt)=>{
      if(evt.key === 'Escape'){//проверяем какая клавиша нажата
        evt.preventDefault();//отменяем депйствия по умолчанию
        replaceFormToPoint();//скрываем форму редактирования открываем точку
        document.removeEventListener('keydown',escKeyDownHandler);//удаляем обрабокчик
      }
    };

    const pointComponent = new WayPointView({//создаем стандартную точку
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: ()=>{//обработчик клика по стрелке
        replacePointToForm();//скрываем точку открываем форму
        document.addEventListener('keydown',escKeyDownHandler);
      }
    });

    const pointEditComponent = new CreateFormView({//форма редактирования
      point,
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onFormSubmit:()=>{
        replaceFormToPoint();//скрываем форму редактирования открываем точку
        document.removeEventListener('keydown',escKeyDownHandler);//удаляем обработчик
      },
      onArrowUpClick:()=>{
        replaceFormToPoint();//скрываем форму редактирования открываем точку
        document.removeEventListener('keydown',escKeyDownHandler);//удаляем обработчик
      }
    });
    function replacePointToForm(){
      replace(pointEditComponent,pointComponent);//скрываем точку открываем форму
    }
    function replaceFormToPoint(){
      replace(pointComponent,pointEditComponent);//скрываем форму редактирования открываем точку
    }
    render (pointComponent, this.#container);//отрисовываем точки в контейнер
  }
}

