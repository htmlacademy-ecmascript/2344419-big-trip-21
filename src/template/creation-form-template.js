import{formatSrtingToDateTime, CreateToUpperCase } from '../utils/utils.js';
import he from 'he';

function createEventTypesTemplate(offerTypes, type, isDisabled) {
  if (offerTypes) {
    return offerTypes.map((item) => `
      <div class="event__type-item">
        <input id="event-type-${he.encode(item.type)}-1" class="event__type-input  visually-hidden"
        type="radio" name="event-type" value="${he.encode(item.type)}" ${isDisabled ? 'disabled' : ''}>
        <label class="event__type-label  event__type-label--${he.encode(item.type)}"
        for="event-type-${he.encode(item.type)}-1">${he.encode(CreateToUpperCase(item.type))}</label>
      </div>
  `).join('');
  }

  return '';
}

function createDestinationListTemplate(pointDestination, destinations, isDisabled) {
  let destinationListTemplate = `
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value="${pointDestination ? he.encode(pointDestination.name) : ''}" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-1">
    `;

  destinations.forEach((destination) => {
    destinationListTemplate +=
      `  <option value="${he.encode(destination.name)}"></option>
    `;
  });

  destinationListTemplate += '</datalist>';

  return destinationListTemplate;
}

function createEventOffersTemplate(pointOffers, pointCheckedOffers, isDisabled) {
  if (pointOffers.length === 0) {
    return '';
  }

  let eventOffersTemplate = `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">`;

  function changeToLowercase(name) {
    return name.split(' ').join('').toLowerCase();
  }

  pointOffers.map((offer) => {
    eventOffersTemplate += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${changeToLowercase(offer.title)}-1" type="checkbox" name="event-offer-${changeToLowercase(offer.title)}" data-offer-id="${offer.id}" ${pointCheckedOffers.length > 0 && pointCheckedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${changeToLowercase(offer.title)}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>

      `;
  });

  eventOffersTemplate += `</div>
      </section >`;

  return eventOffersTemplate;
}

function createDestinationTemplate({description, pictures}) {
  let destinationTemplate = '';

  if (description && description !== '') {
    destinationTemplate +=
        `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description ? description : ''}</p>

          `;
  }

  if (pictures && pictures.length > 0) {
    destinationTemplate += `<div class="event__photos-container">
      <div class="event__photos-tape">`;
    pictures.forEach((picture) => {
      destinationTemplate += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
  }

  destinationTemplate +=
        `</div>
      </div>
    </section>`;

  return destinationTemplate;
}

function createDeleteButtonTemplate(isEditForm, isDeleting, isSaving) {
  if (isEditForm) {
    return `<button class="event__reset-btn"
    type="reset"${isSaving || isDeleting ? ' disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>`;
  }

  return `<button class="event__reset-btn" type="reset"${isSaving ? ' disabled' : ''}>Cancel</button>`;
}

function getDestinationsById(id, destinations) {
  if (id) {
    return destinations.find((destination) => destination.id === id);
  }
  return '';
}
function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function createFormTemplite(point, pointTypes, destinations, offers, isEditForm) {
  const {type, dateFrom, dateTo, basePrice, destination, newPointType, newDestination, isDisabled, isDeleting, isSaving} = point;
  const pointDestination = getDestinationsById(newDestination ? newDestination : destination, destinations);
  let pointOffers = [];

  if (offers.length !== 0) {
    pointOffers = getOffersByType(newPointType ? newPointType : point.type, offers);
  }
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17"
              src="img/icons/${newPointType ? he.encode(newPointType) : he.encode(type)}.png"
              alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1"
            type="checkbox"${isSaving || isDeleting ? ' disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createEventTypesTemplate(pointTypes, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${newPointType ? he.encode(newPointType) : he.encode(type)}
            </label>
              ${createDestinationListTemplate(pointDestination, destinations, isDisabled)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text"
            name="event-start-time" value="${formatSrtingToDateTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text"
            name="event-end-time" value="${formatSrtingToDateTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number"
            name="event-price" value="${he.encode(String(parseInt(basePrice, 10)))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue"
          type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          ${createDeleteButtonTemplate(isEditForm, isDeleting, isSaving)}
          ${isEditForm ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}

        </header>
        <section class="event__details">
          ${pointOffers.length > 0 ? createEventOffersTemplate(pointOffers, point.offers, isDisabled) : ''}
          ${createDestinationTemplate(pointDestination ? pointDestination : '')}
        </section>
      </form>
    </li>`);
}
export {createFormTemplite};
