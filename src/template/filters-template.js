
function getFilterItem(filter, isCheked, isDisabled){
  const {type,count} = filter;
  return (`<div class="trip-filters__filter">
  <input
  id="filter-${type}"
  class="trip-filters__filter-input  visually-hidden"
  type="radio"
  data-item="${type}"
  name="trip-filter"
  ${(isCheked) ? 'checked' : ''}
  ${(isDisabled) ? 'disabled' : ''}
  value="${type}">
  <label class="trip-filters__filter-label"
  for="filter-${type}">${type}</label>
  </div>
  `);
}
function createWayPointTemplite(filterItems){
  const filterItemsTemplate = filterItems.map((filter) => getFilterItem(filter)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}


export {createWayPointTemplite };
