const BASIC_URL = 'https://restcountries.com/v2/name/';
const params = '?fields=name,capital,population,flags,languages';

//робимо HTTP-запит та повертаємо проміс з масивом країн
export function fetchCountries(name) {
  return fetch(`${BASIC_URL}${name}${params}`).then(response => {
    if (!response) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
