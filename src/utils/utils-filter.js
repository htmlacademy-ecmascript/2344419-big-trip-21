import { FilterType } from '../const.js';
import dayjs from 'dayjs';

function isPastDate(date) {
  return date && dayjs(date).isBefore(dayjs(), 'D');
}

function isTodayDate(date) {
  return date && dayjs(date).isSame(dayjs(), 'D');
}

function isFutureDate(date) {
  return date && dayjs(date).isAfter(dayjs(), 'D');
}

function isPointPresent(dateFrom, dateTo) {
  return (isPastDate(dateFrom) || isTodayDate(dateFrom)) && (isFutureDate(dateTo) || isTodayDate(dateTo));
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo))),
};


export { filter };
