const cartCardComponent = ({id, quantity, thumbnail, title, description, price}, discount) => {
  const discountPrice = discount / 100 * price;
  const totalPrice = discountPrice * quantity;

  return `
    <div class="card shadow-lg mb-3" data-id="${id}">
        <div class="row g-0">
          <div class="col-md-5">
            <img src="${thumbnail}" class="w-100 h-100 rounded-start" alt="">
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <div class="product-price">
                <p class="text-warning h2">$
                  <span class="damping-price">${discountPrice}</span>
                  <span class="h5 text-dark text-decoration-line-through">${price}</span>
                </p>
              </div>
              <div class="border border-1 border-dark shadow-lg d-flex justify-content-center p-2">
                <div class="quantity-controller">
                  <button class="btn btn-secondary btn-sm decrease">
                    <i class="fas fa-minus decrease"></i>
                  </button>
                  <p class="d-inline mx-4" id="product-quantity">${quantity}</p>
                  <button class="btn btn-secondary btn-sm increase">
                    <i class="fas fa-plus increase"></i>
                  </button>
                </div>
              </div>
              <div class="product-removal mt-4">
                <button class="btn btn-danger btn-sm w-100 remove-product">
                  <i class="fa-solid fa-trash-can me-2"></i>Remove
                </button>
              </div>
              <div class="mt-2">
                Product Total: $<span class="product-line-price">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
`
};

export default cartCardComponent;
