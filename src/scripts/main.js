import * as bootstrap from 'bootstrap' // Import all of Bootstrap's JS
import cardComponent from "./cardComponent";
import {fetchItems} from "./api";

let products;
const dropdownMenu = document.getElementById('sort-options');
const cardsContainer = document.getElementById('cards');

const categoryClickHandler = (evt) => {
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
        <li>
          <a 
            class="dropdown-item" 
            href="#"
            data-category="${category}"
          >
          ${categoryNormalizer(category)}
          </a>
        </li>
      `).join('\n');

  dropdownMenu.insertAdjacentHTML('beforeend', categoriesHTML);
  dropdownMenu.addEventListener('click', categoryClickHandler);
}

function renderCards(items) {
  const cardsHTML = items.map(item => cardComponent(item));
  cardsContainer.innerHTML = cardsHTML.join('');
}

(async function init() {
  try {
    const [categoriesResp, productsResp] = await Promise.all([
      fetchItems('https://dummyjson.com/products/categories'),
      fetchItems('https://dummyjson.com/products?limit=100'),
    ])


    renderCategories(categoriesResp);
    renderCards(productsResp.products);
    products = productsResp.products;
  } catch (e) {
    console.error('Error initializing:', e);
  }
})();

