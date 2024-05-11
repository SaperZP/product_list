const cardComponent = ({images, title, description, price}) => `
  <div class="col">
    <div class="card text-center h-100">
    <div class="ratio ratio-1x1">
      <img src="${images[0]}" class=" object-fit-contain" alt="item_image">
    </div>
      <div class="card-body h-50 d-flex row">
        <h5 class="card-title" style="max-height: 25%">${title}</h5>
        
        <p class="card-text overflow-hidden" style="max-height: 60%">${description}</p>
        <div class="align-self-end">
        <p class="card-text">$${price}</p>
        
        <a href="#" class="btn btn-primary">Add to cart</a>
        </div>
      </div>
    </div>
</div>
`;

export default cardComponent;
