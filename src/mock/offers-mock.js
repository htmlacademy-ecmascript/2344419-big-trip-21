import { getRandomId } from '../utils.js';

const generateMockOffers = (type) => ({
  id: crypto.randomUUID,
  title: `Offer ${type}`,
  price: getRandomId(6, 22)
});


export {generateMockOffers};
