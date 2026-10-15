import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalPages = 0;

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    totalPages = Math.ceil(data.totalHits / PER_PAGE);
    createGallery(data.hits);
    updateLoadMoreState();
  } catch {
    showErrorToast();
  } finally {
    hideLoader();
  }
}

async function onLoadMoreClick() {
  currentPage += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    createGallery(data.hits);
    scrollGallery();
    updateLoadMoreState();
  } catch {
    currentPage -= 1;
    showLoadMoreButton();
    showErrorToast();
  } finally {
    hideLoader();
  }
}

function updateLoadMoreState() {
  if (currentPage < totalPages) {
    showLoadMoreButton();
    return;
  }

  hideLoadMoreButton();
  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
  });
}

function scrollGallery() {
  const card = document.querySelector('.gallery-item');
  if (!card) return;

  const { height } = card.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

function showErrorToast() {
  iziToast.error({
    message: 'Something went wrong. Please try again later.',
    position: 'topRight',
  });
}
