import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

//ініціалізуємо елементи
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
// console.log(refs);

refs.input.addEventListener('input', debounce(getValue, DEBOUNCE_DELAY));

function getValue(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearPage();
  } else {
    fetchCountries(inputValue)
      .then(data => {
        if (data.length > 10) {
          logInfo();
        } else if (data.length > 1) {
          refs.info.innerHTML = '';
          refs.list.innerHTML = listMarkUp(data);
        } else {
          refs.list.innerHTML = '';
          refs.info.innerHTML = infoContainerMarkUp(data);
        }
      })
      .catch(logError);
  }
}

//очистка сторінки
function clearPage() {
  refs.list.innerHTML = '';
  //   console.log(refs.list.innerHTML);
  refs.info.innerHTML = '';
  //   console.log(refs.info.innerHTML);
}

//якщо повернуло біль ніж 10 країн
function logInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.', {
    clickToClose: true,
  });
}

//якщо введено не вірно назву краіни
function logError() {
  Notify.failure('Oops, there is no country with that name', {
    clickToClose: true,
  });
}

//Якщо бекенд повернув від 2-х до 10-и країн
function listMarkUp(countries) {
  return countries
    .map(country => {
      return `<li class='item'><img src='${country.flags.svg}' width='35' height="25"><p class='text'>${country.name}</p></li>`;
    })
    .join('');
}

//якщо повертається одна країна
function infoContainerMarkUp(countries) {
  //країна стає першім елементом масиву
  const country = countries[0];

  //вибираємо усі мови країни
  const languages = country.languages
    .reduce((acc, language) => {
      acc.push(language.name);
      //   console.log(acc);
      return acc;
    }, [])
    .join(', ');
  //   console.log(languages);

  //витягуємо потрібні нам властивості
  const { flags, name, capital, population } = country;

  return `<div class='country'><img src = '${flags.svg}' width='50' height = '40'><h1>${name}</h1></div><p><span class='heads'>Capital:</span> ${capital}</p><p><span class='heads'>Population:</span> ${population}</p><p><span class='heads'>Languages:</span> ${languages}</p>`;
}
