import {FilterType} from '../const.js';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]:(points)=>points,
  [FilterType.FUTURE]:(points)=>points.filter((point)=>isPointExpiringFuture(point.dateFrom)),
  [FilterType.PRESENT]:(points)=>points.filter((point)=>(isPointExpiringToday(point.dateFrom) || isPointExpiredPast(point.dateFrom) && isPointExpiringToday(point.dateTo))),//настоящее
  [FilterType.PAST]:(points)=>points.filter((point)=>isPointExpiredPast(point.dateFrom) || isPointExpiredPast(point.dateTo)),//прошлое
};

function isPointExpiredPast(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isPointExpiringToday(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

function isPointExpiringFuture(dueDate) {
  return dueDate && dayjs(dueDate).isBefore(dayjs(), 'D');
}


export {filter};
