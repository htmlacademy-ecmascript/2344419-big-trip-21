import { sortType } from '../const.js';
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
  [sortType.DAY]:(points) => points.toSorted(getPointsDateDifference),
  [sortType.PRICE]:(points) => points.toSorted(getPointsPriceDifference),
  [sortType.TIME]:(points) => points.toSorted(getPointsTimeDifference),
  [sortType.EVENT]:()=>{
    throw new Error(`Sort by ${sortType.EVENT} is not implemented`);
  },
  [sortType.OFFER]:()=>{
    throw new Error(`Sort by ${sortType.OFFER} is not implemented`);
  }
};

function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}
export {sort, getPointsDateDifference, getPointsPriceDifference, getPointsTimeDifference, isDateEqual };
