
import {filter} from'../utils-filter.js';

function generateFilter(points){
  return Object.entries(filter).map(//получем массив массивов ключ-значение из объекта и итерируемся по нему
    ([filterType,filterPoints])=>({
      type:filterType,
      count:filterPoints(points).length,//количество задач соответствующих фильтру
    })
  );
}
export {generateFilter};
