import {getRandomPoint} from '../mock/waypoints-mock.js';
const POINT_COUNT = 3;

export default class PointModel {
  point = Array.from({length:POINT_COUNT},getRandomPoint);//создаем массив точек

  getPoint(){
    return this.point;
  }
}
