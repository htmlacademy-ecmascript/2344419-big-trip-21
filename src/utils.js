import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];//случайное число

export{getRandomArrayElement};

const DATE_FORMAT = {
  fullData: 'DD/MM/YY HH:mm',
  monthDay: 'MMM DD',
  watchMinute: 'HH:mm',
};
const createPointDate = (data) =>//дата маршрута
  data ? dayjs(data).format(DATE_FORMAT.monthDay) : '';
const createStartEndPointDate = (data) =>//дата начала и конца маршрута
  data ? dayjs(data).format(DATE_FORMAT.fullData) : '';
const createLengthPointDate = (data) =>//протяженность маршрута часы/минуты
  data ? dayjs(data).format(DATE_FORMAT.watchMinute) : '';
