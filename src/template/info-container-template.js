function infoContainerTemplite(destinations, date, price) {
  if (destinations === '' && date === '' && price === '') {
    return '<div></div>';
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations}</h1>

        <p class="trip-info__dates">${date}</p>
      </div>

      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`);
}

export {infoContainerTemplite};
