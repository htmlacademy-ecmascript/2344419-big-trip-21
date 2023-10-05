import { FilterType } from '../const.js';
import dayjs from 'dayjs';

function isPointPresent(dateFrom, dateTo) {
  return dayjs(dateFrom).diff(dayjs()) <= 0 && dayjs(dateTo).diff(dayjs()) >= 0;
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo))),
};


export { filter };
