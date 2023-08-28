const DESTINATION_COUNT = 1;
const OFFER_COUNT = 5;
const POINT_COUNT = 4;
const DEFAULT_TYPE = 'flight';

const WAYPOINT_TYPE = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'CheckIn',
  'Sightseeing',
  'Restaurant',
];

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE,
};

const CITIES_NAMES = [
  'Moskow',
  'St. Petersburg',
  'Rio',
  'Kolomna',
  'Taganrog',
  'Paris',
  'London',
  'Geneva',
];
const ARR_DESRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];
const FAVORIT = [
  true,
  false,
];

const BLANK_POINT = {
  id: 0,
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type:'flight'
};
export {
  WAYPOINT_TYPE,
  CITIES_NAMES,
  ARR_DESRIPTIONS,
  FAVORIT,
  DESTINATION_COUNT,
  OFFER_COUNT,
  POINT_COUNT,
  DEFAULT_TYPE,
  POINT_EMPTY,
  BLANK_POINT
};
