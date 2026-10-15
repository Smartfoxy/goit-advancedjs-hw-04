import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

const formEl = document.querySelector('.form');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(data => {
      if (data.hits.length === 0) {
        showError(
          'Sorry, there are no images matching your search query. Please try again!'
        );
        return;
      }

      createGallery(data.hits);
    })
    .catch(() => {
      showError('Something went wrong. Please try again later.');
    })
    .finally(() => {
      hideLoader();
      formEl.reset();
    });
}

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    theme: 'dark',
    backgroundColor: '#EF4040',
    progressBarColor: '#B51B1B',
    maxWidth: 432,
  });
}
