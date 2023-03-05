import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
let dataLength = null;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  if (event.target.value.trim() === '') {
    clearMarkup();
    return;
  }

  fetchCountries(event.target.value.trim())
    .then(resolve => {
      if (!resolve.ok) {
        return Notify.failure('Oops, there is no country with that name');
      }
      return resolve.json();
    })
    .then(data => {
      if (data.length === dataLength) {
        return;
      } else {
        dataLength = data.length;
        clearMarkup();

        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length < 10) {
          creatCountryListMarkup(data);
        } else if (data.length === 1) {
          creatCountryInfoMarkup(data);
        }
      }
    })
    .catch(error => console.log(error));
}

function creatCountryListMarkup(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class = "country-list__item">
          <img src = ${flags.svg} width = 40px>
          <p>${name.official}</p>
          </li>`;
    })
    .join('');

  countryList.insertAdjacentHTML('beforeend', markup);
}

function creatCountryInfoMarkup(data) {
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      const countryLanguages = Object.values(languages).join(', ');
      return `<div class = "country-info__container">
   <img src = ${flags.svg} width = 80px>
   <p class = "country-info__name">${name.official}</p>
   </div>
   <p><span class= "country-info__text">Capital:</span>${capital}</p>
   <p><span class= "country-info__text">Population:</span>${population}</p>
   <p><span class= "country-info__text">Languages:</span>${countryLanguages}</p>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
