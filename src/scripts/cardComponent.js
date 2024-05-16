const cardComponent = ({thumbnail, title, description, price}, quantity) => `
  <div class="col">
    <div class="card text-center h-100">
    <div class="ratio ratio-1x1">
      <img src="${thumbnail}" class=" object-fit-contain" alt="item_image">
    </div>
      <div class="card-body h-50 d-flex row">
        <h5 class="card-title" style="max-height: 25%">${title}</h5>
        <p class="card-text overflow-hidden" style="max-height: 60%">${description}</p>
        <div class="align-self-end">
          <p class="card-text">$${price}</p>            
            <button type="button" class="btn btn-primary position-relative">Add to cart
            
            ${quantity ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-3">
              ${quantity}
              <span class="visually-hidden">unread messages</span>
            </span>` : ''}
            </button>
        </div>
      </div>
    </div>
</div>
`;

export default cardComponent;
