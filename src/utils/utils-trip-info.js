import dayjs from 'dayjs';

function getDestinationsById(id, destinations) {
  if (id) {
    return destinations.find((destination) => destination.id === id);
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

export {getOffersByType, sortPointsByDay, getCheckedOffers, getDestinationsById};
