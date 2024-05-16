const CartPricesComponent = (subtotal, tax, shipping, total) => {

  return `
      <table class="table">
          <tbody>
            <tr class="text-end">
              <th class="text-start">Subtotal</th>
              <td>$<span class="subtotal">${subtotal}</span></td>
            </tr>
            <tr class="text-end">
              <th class="text-start">Tax(18%)</th>
              <td>$<span class="tax">${tax}</span></td>
            </tr>
            <tr class="text-end">
              <th class="text-start">Shipping</th>
              <td>$<span class="shipping">${shipping}</span></td>
            </tr>
            <tr class="text-end">
              <th class="text-start">Total</th>
              <td>$<span class="total">${total}</span></td>
            </tr>
          </tbody>
      </table>
  `
};

export default CartPricesComponent;
