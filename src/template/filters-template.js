
function getFilterItem(filter, isCheked){
  const {type,count} = filter;
  return (`<div class="trip-filters__filter">
  <input
  id="filter-${type}"
  class="trip-filters__filter-input  visually-hidden"
  type="radio"
  data-item="${type}"
  name="trip-filter"
  ${isCheked ? 'checked' : ''}
  ${count === 0 ? 'disabled' : ''}
  value="${type}">
  <label class="trip-filters__filter-label"
  for="filter-${type}">${type}</label>
  </div>
  `);
}
function createWayPointTemplite(filterItems){
  const filterItemsTemplate = filterItems.map((filter, index) => getFilterItem(filter, index === 0)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}


export {createWayPointTemplite };
