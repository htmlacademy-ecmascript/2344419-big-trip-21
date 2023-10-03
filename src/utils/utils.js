import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;
const getRandomId = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const DATE_FORMAT = {
  fullData: 'DD/MM/YY HH:mm',
  monthDay: 'MMM DD',
  watchMinute: 'HH:mm',
};

const CreateToUpperCase = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const FormatStringToShortDate = (inputDate) =>
  inputDate ? dayjs(inputDate).format(DATE_FORMAT.monthDay) : '';
const formatSrtingToDateTime = (inputDate) =>
  inputDate ? dayjs(inputDate).format(DATE_FORMAT.fullData) : '';
const formatStringToTime = (inputDate) =>
  inputDate ? dayjs(inputDate).format(DATE_FORMAT.watchMinute) : '';

const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
};
const Duration = {
  MIN: 59,
  DAY: 7,
  HOUR: 23
};

let date = dayjs().subtract(getRandomId(0, Duration.DAY), 'day').toDate();

const getDate = ({ next }) => {
  const minsGap = getRandomId(0, Duration.MIN);
  const hoursGap = getRandomId(0, Duration.HOUR);
  const daysGap = getRandomId(0, Duration.DAY);
  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .subtract(daysGap, 'day')
      .toDate();
  }
  return date;
};

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function getCheckedOffers(checkedOffersId, pointOffers) {
  return checkedOffersId.map((IdOffer) => pointOffers.find((offer) => offer.id === IdOffer));
}

export {
  getOffersByType,
  getCheckedOffers,
  getRandomId,
  getDate,
  FormatStringToShortDate,
  formatSrtingToDateTime,
  formatStringToTime,
  capitalize,
  getPointDuration,
  CreateToUpperCase,
  updateItem
};
