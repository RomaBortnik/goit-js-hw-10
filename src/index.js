import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  clearInput(event.target.value.trim());
  fetchCountries(event.target.value.trim())
    .then(resolve => {
      let dataLength = null;
      if (!resolve.ok) {
        return Notify.failure('Oops, there is no country with that name');
      }
      return resolve.json();
    })
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length < 10) {
        creatCountryListMarkup(data);
      } else if (data.length === 1) {
        console.log(data);
        creatCountryInfoMarkup(data);
      }
    })
    .catch(error => console.log(error));
}

function creatCountryListMarkup(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li>
          <img src = ${flags.svg} width = 40px>
          <p>${name.official}</p>
          </li>`;
    })
    .join('');

  countryList.insertAdjacentHTML('beforeend', markup);
}

function clearInput(value) {
  if (value === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function creatCountryInfoMarkup(data) {
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      const countryLanguages = Object.values(languages).join(', ');
      return `<div>
   <img src = ${flags.svg} width = 40px>
   <p>${name.official}</p>
   </div>
   <p><span>Capital: </span>${capital}</p>
   <p><span>Population: </span>${population}</p>
   <p><span>Languages: </span>${countryLanguages}</p>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}
