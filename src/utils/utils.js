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

function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function getCheckedOffers(checkedOffersId, pointOffers) {
  return checkedOffersId.map((IdOffer) => pointOffers.find((offer) => offer.id === IdOffer));
}

export {
  getOffersByType,
  getCheckedOffers,
  FormatStringToShortDate,
  formatSrtingToDateTime,
  formatStringToTime,
  capitalize,
  getPointDuration,
  CreateToUpperCase,
};
