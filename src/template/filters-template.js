function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function getFilterItem(filter, currentFilterType){
  const {type} = filter;
  return (`<div class="trip-filters__filter">
  <input
  id="filter-${type}"
  class="trip-filters__filter-input  visually-hidden"
  type="radio"
  data-item="${type}"
  name="trip-filter"
  value="${type}" ${type === currentFilterType ? 'checked="true"' : ''}}>
  <label class="trip-filters__filter-label"
  for="filter-${type}">${capitalize(type)}</label>
  </div>
  `);
}
function createWayPointTemplite(filterItems, currentFilterType){
  const filterItemsTemplate = filterItems.map((filter) => getFilterItem(filter, currentFilterType)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}


export {createWayPointTemplite };
