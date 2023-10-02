import dayjs from 'dayjs';

function getDestinationsById(id, destinations) {
  if (id) {
    return destinations.find((destination) => destination.id === id);
  }
  return '';
}

function getDestinationByName(name, destinations) {
  if (destinations.some((destination) => destination.name === name)) {
    return destinations.find((destination) => destination.name === name);
  }
  return '';
}

function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function getCheckedOffers(checkedOffersId, pointOffers) {
  return checkedOffersId.map((IdOffer) => pointOffers.find((offer) => offer.id === IdOffer));
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

export { getOffersByType, sortPointsByDay, getCheckedOffers, getDestinationsById, getDestinationByName };
