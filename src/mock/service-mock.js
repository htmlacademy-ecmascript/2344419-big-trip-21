import { generateMockOffers } from './offers-mock.js';
import { generateMockDestinations } from './destinations-mock.js';
import { generateMockPoints } from './waypoints-mock.js';
import { WAYPOINT_TYPE, DESTINATION_COUNT, POINT_COUNT, OFFER_COUNT } from '../const.js';
import { getRandomArrayElement, getRandomId } from '../utils/utils.js';

export default class MockService {
  destinations = [];
  offers = [];
  points = [];

  constructor(){
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  getDestinations(){
    return this.destinations;
  }

  getOffers(){
    return this.offers;
  }

  getPoints(){
    return this.points;
  }

  generateDestinations(){
    return Array.from(
      {length:DESTINATION_COUNT},
      ()=>generateMockDestinations()
    );
  }

  generateOffers(){
    return WAYPOINT_TYPE.map((type)=>({
      type,
      offers:Array.from({length:getRandomId(0,OFFER_COUNT)}, ()=>generateMockOffers(type))
    }));
  }

  generatePoints(){
    return Array.from({length:POINT_COUNT},()=>{
      const type = getRandomArrayElement(WAYPOINT_TYPE);
      const destination = getRandomArrayElement(this.destinations);
      const hasOffers = getRandomId (0,1);
      const offersByType = this.offers
        .find((offerByType)=>offerByType.type === type);

      const offerIds = (hasOffers)
        ? offersByType.offers
          .slice(0,getRandomId(0,OFFER_COUNT))
          .map((offer)=>offer.id)
        : [];
      return generateMockPoints(type, destination.id, offerIds);
    });
  }
}
