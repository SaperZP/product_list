import * as bootstrap from 'bootstrap';
import cardComponent from "./cardComponent";
import {fetchItems} from "./api";
import {generateRandomId} from "./utils";
import cartCardComponent from "./cartCardComponent";
import cartPricesComponent from "./cartPricesComponent";

let products = [];
let productsInCart = [];
let currentPage = 1;
const itemsPerPage = 10;
const dropdownMenu = document.getElementById('sort-options');
const cardsContainer = document.getElementById('cards');
const paginationContainer = document.getElementById('pagination');
const addItemModal = document.getElementById('formModal');
const modalForm = addItemModal.querySelector('form');
const cartItemsContainer = document.getElementById('cart-items');
const cartPricesContainer = document.getElementById('card-prices');


const categoryClickHandler = (evt) => {
  currentPage = 1;
  const clickedItem = evt.target;
  const category = clickedItem.dataset.category;

  if (clickedItem.classList.contains('dropdown-item') && category) {
    const filteredByCategory = products.filter(product => product.category === category)
    renderCards(filteredByCategory);
  } else {
    renderCards(products)
  }
}

function renderCategories(categories) {
  const categoryNormalizer = (category) => category[0].toUpperCase() + category.slice(1).replace('-', ' ');
  const categoriesHTML = categories.map(category => `
          <a 
            class="dropdown-item" 
            href="#"
            data-category="${category}"
          >
          ${categoryNormalizer(category)}
          </a>
      `).join('\n');

  dropdownMenu.insertAdjacentHTML('beforeend', categoriesHTML);
  dropdownMenu.addEventListener('click', categoryClickHandler);
}

function renderCards(items) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = items.slice(startIndex, endIndex);
  const cardsHTML = itemsToDisplay.map(item => {
    const isChosen = productsInCart.find(itemFromCart => itemFromCart.id === item.id);
    return cardComponent(item, isChosen?.quantity)
  });
  cardsContainer.innerHTML = cardsHTML.join('');
  renderPagination(items.length);
}

function changePageHandler(page) {
  if (page < 1 || page > Math.ceil(products.length / itemsPerPage)) {
    return;
  }
  currentPage = page;
  renderCards(products);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHTML = `
    <li data-page="${currentPage - 1}" class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#">Previous</a>
    </li>
  `;
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li data-page="${i}" class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#">${i}</a>
      </li>
    `;
  }
  paginationHTML += `
    <li data-page="${currentPage + 1}" class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#">Next</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;

  paginationContainer.addEventListener('click', (event) => {
    const target = event.target.closest('.page-item:not(.disabled)');
    console.log(target.dataset.page);

    if (target) {
      const pageNumber = parseInt(target.dataset.page);
      changePageHandler(pageNumber);
    }
  });
}

function renderCart() {
  const hasItems = productsInCart.length;
  const discount = hasItems ? 15 : 0;
  const tax = hasItems ? 13 : 0;
  const shipping = hasItems ? 5 : 0;
  const subtotal = productsInCart.reduce((total, product) => total + (product.price / 100 * discount) + product.quantity, 0);
  const total = subtotal + tax + shipping;
  const cartItems = productsInCart.map(product => cartCardComponent(product, discount));
  cartItemsContainer.innerHTML = cartItems.join();

  cartPricesContainer.innerHTML = cartPricesComponent(subtotal, tax, shipping, total);
}

modalForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('add-name').value;
  const price = document.getElementById('add-price').value;
  const description = document.getElementById('add-description').value;
  const thumbnail = document.getElementById('add-image').value;
  const id = generateRandomId(15);

  products = [{id, title, price, description, thumbnail}, ...products];
  renderCards(products);

  const modal = bootstrap.Modal.getInstance(addItemModal);
  modal.hide();
});

cardsContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'button' && event.target.textContent.includes('Add to cart')) {
    const title = event.target.parentNode.parentNode.querySelector('.card-title').textContent;
    const isCartProduct = productsInCart.find(product => product.title === title);
    const chosenProduct = products.find(product => product.title === title);
    isCartProduct ? isCartProduct.quantity += 1 : productsInCart = [...productsInCart, {...chosenProduct, quantity: 1}];
  }

  renderCart();
  renderCards(products);
});

cartItemsContainer.addEventListener('click', (event) => {
  const classList = event.target.classList;
  const itemId = Number(event.target.closest('[data-id]').dataset.id);

  if (classList) {
        switch (true) {
          case classList.contains('increase'):
            productsInCart.find(product => product.id === itemId).quantity += 1;
            renderCart();
            renderCards(products);
            break;
          case classList.contains('decrease'):
            const item = productsInCart.find(product => product.id === itemId);
            item.quantity > 1 ? item.quantity -= 1 : productsInCart = productsInCart.filter(product => product.id !== itemId);
            renderCart();
            renderCards(products);
            break;
          case classList.contains('remove-product'):
            productsInCart = productsInCart.filter(product => product.id !== itemId);
            renderCart();
            renderCards(products);
            break;
          default:
            console.log('Clicked element does not contain any recognized class');
        }
      }
});


(async function init() {
  try {
    const [categoriesResp, productsResp] = await Promise.all([
      fetchItems('https://dummyjson.com/products/categories'),
      fetchItems('https://dummyjson.com/products?limit=100'),
    ])

    renderCategories(categoriesResp);
    products = productsResp.products;
    renderCards(products);
    renderCart()
  } catch (e) {
    console.error('Error initializing:', e);
  }
})();
