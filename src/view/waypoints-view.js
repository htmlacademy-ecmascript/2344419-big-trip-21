//точки маршрута
import { createWayPointTemplite } from '../template/waypoints-template.js';
import AbstractView from '../framework/view/abstract-view.js';


export default class WayPointView extends AbstractView{
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, pointDestination, pointOffers, onEditClick, onFavoriteClick }){
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleEditClick = onEditClick;//функция вызова формы редактирования
    this.#handleFavoriteClick = onFavoriteClick;//звездочка

    this.element.querySelector('.event__rollup-btn')//кнопка стрелка вниз
      .addEventListener('click',this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')//звезда
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template(){
    return createWayPointTemplite({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffers:this.#pointOffers,
    });
  }

  #editClickHandler = (evt) =>{//стрелка
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {//смена звездочки
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
