import * as bootstrap from 'bootstrap'; // Import all of Bootstrap's JS
import cardComponent from "./cardComponent";
import { fetchItems } from "./api";

let products;
let currentPage = 1;
const itemsPerPage = 10; // Number of items per page
const dropdownMenu = document.getElementById('sort-options');
const cardsContainer = document.getElementById('cards');
const paginationContainer = document.getElementById('pagination');

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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = items.slice(startIndex, endIndex);
  const cardsHTML = itemsToDisplay.map(item => cardComponent(item));
  cardsContainer.innerHTML = cardsHTML.join('');
  renderPagination(items.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHTML = `
    <li data-page="${currentPage -1}" class="page-item ${currentPage === 1 ? 'disabled' : ''}">
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
    <li data-page="${currentPage +1}" class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#">Next</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;

  paginationContainer.addEventListener('click', (event) => {
    const target = event.target.closest('.page-item:not(.disabled)');
    console.log(target.dataset.page);

    if (target) {
      const pageNumber = parseInt(target.dataset.page);
      changePage(pageNumber);
    }
  });
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(products.length / itemsPerPage)) {
    return;
  }
  currentPage = page;
  renderCards(products);
}

(async function init() {
  try {
    const [categoriesResp, productsResp] = await Promise.all([
      fetchItems('https://dummyjson.com/products/categories'),
      fetchItems('https://dummyjson.com/products?limit=100'),
    ])

    renderCategories(categoriesResp);
    products = productsResp.products;
    renderCards(products);
  } catch (e) {
    console.error('Error initializing:', e);
  }
})();
