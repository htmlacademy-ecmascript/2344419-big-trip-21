import Observable from '../framework/observable.js';
export default class PointsModel extends Observable {
  #service = null;

  constructor(service){
    super();
    this.#service = service;
    // this.#service.points.then((points)=>{
    //console.log(points);
    // });
  }

  get points(){
    return this.#service.getPoints;
  }

}
