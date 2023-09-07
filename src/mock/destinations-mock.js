import {getRandomArrayElement } from '../utils/utils.js';
import {CITIES_NAMES, ARR_DESRIPTIONS} from '../const.js';

const generateMockDestinations = () => {
  const city = getRandomArrayElement(CITIES_NAMES);
  const photos = `https://loremflickr.com/300/200?random=${crypto.randomUUID()}`;

  return {
    id: crypto.randomUUID(),
    name: city,
    description: getRandomArrayElement(ARR_DESRIPTIONS),
    pictures:[
      {'src': photos,
        'description':`${city} description`,
      }
    ]
  };
};


export {generateMockDestinations};
