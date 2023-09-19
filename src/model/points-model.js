import Observable from '../framework/observable.js';
import { getRandomId, updateItem } from '../utils/utils.js';
import { POINT_COUNT } from '../const.js';


export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = Array.from({length: POINT_COUNT}, getRandomId(1,4));

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      // console.log(points);

      //console.log(points.map(this.#adaptToClient));
    });
  }


  get points() {
    return this.#points;
  }

  update(updateType, point) {//изменение
    const updatePoint = this.#pointsApiService.updatePoint(point);
    this.#points = updateItem(this.#points, updatePoint);
    this._notify(updateType,updatePoint);
  }

  add(updateType, point) {//добавление
    const addedPoint = this.#pointsApiService.addPoint(point);
    this.#points.push(addedPoint);
    this._notify(updateType.addedPoint);
  }

  delete(updateType, point) {//удаление
    this.#pointsApiService.deletePoint(point);
    this.#points = this.#points.filter((pointItem)=>pointItem.id !== point.id);
    this._notify(updateType);
  }

  #adaptToClient(task) {
    const adaptedTask = {...task,
      dueDate: task['due_date'] !== null ? new Date(task['due_date']) : task['due_date'], // На клиенте дата хранится как экземпляр Date
      isArchive: task['is_archived'],
      isFavorite: task['is_favorite'],
      repeating: task['repeating_days'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask['due_date'];
    delete adaptedTask['is_archived'];
    delete adaptedTask['is_favorite'];
    delete adaptedTask['repeating_days'];

    return adaptedTask;
  }
}
