
import { getRandomArrayElement } from '../utils';

const waypointType = [
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
//загружаются на сервер при старте приложения
//по умолчанию сверху вниз от старых к нвым по дате начала события, вне зависимости от длительности
//в случае отсутствия точек маршрута вместо списка отображается текст:
// «Click New Event to create your first point».

const waypointName = [
  'Moskow',
  'St. Petersburg',
  'Rio',
  'Kolomna',
  'Taganrog',
  'Paris',
  'London',
  'Geneva',
];
const arrDescription = [
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
const favotit = [
  'true',
  'false',
];

const Destination = [
  {
    'id': 1,
    'discription': getRandomArrayElement(arrDescription),
    'name': getRandomArrayElement(waypointName),
    'pictures':[
      {
        'src':'https://loremflickr.com/248/152?23',
        'discription': getRandomArrayElement(arrDescription),
      }
    ]
  },
  {
    'id': '2',
    'discription': getRandomArrayElement(arrDescription),
    'name': getRandomArrayElement(waypointName),
    'pictures':[
      {
        'src':'https://loremflickr.com/248/152?24',
        'discription': getRandomArrayElement(arrDescription),
      }
    ]
  },
  {
    'id': '3',
    'discription': getRandomArrayElement(arrDescription),
    'name': getRandomArrayElement(waypointName),
    'pictures':[
      {
        'src':'https://loremflickr.com/248/152?25',
        'discription': getRandomArrayElement(arrDescription),
      }
    ]
  },

];
const Offer = [//доп опции
  {'type':getRandomArrayElement(waypointType),
    'offers':[
      { 'id':'1',
        'title':getRandomArrayElement(arrDescription),
        'price':'12',
      }
    ]
  },
  {'type':getRandomArrayElement(waypointType),
    'offers':[
      { 'id':'1',
        'title':getRandomArrayElement(arrDescription),
        'price':'16',
      }
    ]
  },
  {'type':getRandomArrayElement(waypointType),
    'offers':[
      { 'id':'1',
        'title':getRandomArrayElement(arrDescription),
        'price':'10',
      }
    ]
  },
] ;

const Points = [//созданные маршруты
  {
    'basePrice': 1100,
    'date':'2019-05-10T22:55:56.845Z',
    'destination':Destination.id,
    'id': '1',
    'isFavorite':getRandomArrayElement(favotit),
    'type':getRandomArrayElement(waypointType),
  },
  {
    'basePrice': 1100,
    'date':'2019-07-10T22:55:56.845Z',
    'destination':Destination.id,
    'id': '2',
    'isFavorite':getRandomArrayElement(favotit),
    'type':getRandomArrayElement(waypointType),
  },
  {
    'basePrice': 600,
    'date':'2019-06-10T22:55:56.845Z',
    'destination':Destination.id,
    'id': '3',
    'isFavorite':getRandomArrayElement(favotit),
    'type':getRandomArrayElement(waypointType),
  },

];
const LocalPoint =
  {
    'basePrice': 1100,
    'dateFrom':'2020-09-10T22:55:56.845Z',
    'dateTo':'2020-09-11T11:22:13.375Z',
    'destination':Destination.id,
    'id': '0',
    'isFavorite':getRandomArrayElement(favotit),
    'type':getRandomArrayElement(waypointType),
  };

const getRandomPoint = () =>getRandomArrayElement(Points);//формируем моки

export {Offer, Points, LocalPoint, getRandomPoint};

