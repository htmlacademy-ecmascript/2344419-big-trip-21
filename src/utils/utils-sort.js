import { SortType } from '../const.js';
import dayjs from 'dayjs';

const getPointsDateDifference = (pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
const getPointsPriceDifference = (pointA, pointB) =>{
  const pointAPrice = pointA.basePrice;
  const pointBPrice = pointB.basePrice;
  return pointBPrice - pointAPrice;
};
const getPointsTimeDifference = (pointA, pointB) =>{
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBDuration - pointADuration;
};

const sort = {
  [SortType.DAY]:(points) => points.toSorted(getPointsDateDifference),
  [SortType.PRICE]:(points) => points.toSorted(getPointsPriceDifference),
  [SortType.TIME]:(points) => points.toSorted(getPointsTimeDifference),
  [SortType.EVENT]:()=>{
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]:()=>{
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}
export {sort, getPointsDateDifference, getPointsPriceDifference, getPointsTimeDifference, isDateEqual };
