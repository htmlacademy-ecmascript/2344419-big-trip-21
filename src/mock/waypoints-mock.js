
import { getRandomArrayElement, getRandomId, getDate} from '../utils/utils.js';
import { FAVORIT } from '../const.js';

const generateMockPoints = (type, destinationId, offerIds) => ({
  id: crypto.randomUUID(),
  basePrice: getRandomId (60, 1000),
  dateFrom: getDate({next:false}),
  dateTo: getDate({next:true}),
  destination: destinationId,
  isFavorite: getRandomArrayElement(FAVORIT),
  offers: offerIds,
  type
});

export { generateMockPoints };

