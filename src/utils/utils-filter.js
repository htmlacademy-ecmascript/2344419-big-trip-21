import {FilterType} from '../const.js';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]:(points)=>points,//все
  [FilterType.FUTURE]:(points)=>points.filter((point)=>isPointExpiringFuture(point.dateFrom)),//будущее
  [FilterType.PRESENT]:(points)=>points.filter((point)=>(isPointExpiringToday(point.dateFrom) || isPointExpiredPast(point.dateFrom) && isPointExpiringToday(point.dateTo))),//настоящее
  [FilterType.PAST]:(points)=>points.filter((point)=>isPointExpiredPast(point.dateFrom) || isPointExpiredPast(point.dateTo)),//прошлое
};

function isPointExpiredPast(dueDate) {//прошлое
  return dueDate && dayjs().isAfter(dueDate, 'D');//следует после
}

function isPointExpiringToday(dueDate) {//настоящее
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');//является таким же
}

function isPointExpiringFuture(dueDate) {//будущее
  return dueDate && dayjs(dueDate).isBefore(dayjs(), 'D');//находится до
}


export {filter};
