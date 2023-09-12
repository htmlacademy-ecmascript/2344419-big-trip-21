import { getRandomId } from '../utils/utils.js';

const generateMockOffers = (type) => ({
  id: getRandomId(1,1000),
  title: `Offer ${type}`,
  price: getRandomId(6, 22)
});


export {generateMockOffers};
