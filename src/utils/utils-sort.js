
import dayjs from 'dayjs';

const getPointsDateDifference = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const getPointsPriceDifference = (pointA, pointB) => {
  const pointAPrice = pointA.basePrice;
  const pointBPrice = pointB.basePrice;
  return pointBPrice - pointAPrice;
};
const getPointsTimeDifference = (pointA, pointB) => {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBDuration - pointADuration;
};


function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}
export { getPointsDateDifference, getPointsPriceDifference, getPointsTimeDifference, isDateEqual };
