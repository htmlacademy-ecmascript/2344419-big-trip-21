//точки маршрута
import { createWayPointTemplite } from '../template/waypoints-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class WayPointView extends AbstractView{
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;

  constructor({point, pointDestination, pointOffers, onEditClick }){
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleEditClick = onEditClick;//функция вызова формы редактирования

    this.element.querySelector('.event__rollup-btn')//находим кнопку в элементе
      .addEventListener('click',this.#editClickHandler);//вешаем обработчик
  }

  get template(){
    return createWayPointTemplite({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffers:this.#pointOffers,
    });
  }

  #editClickHandler = (evt) =>{
    evt.preventDefault();// отмена действий по умолчанию
    this.#handleEditClick();//вызываем функцию обработчика
  };
}
