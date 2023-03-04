export const fetchCountries = value => {
  const options = '?fields=name,capital,population,flags,languages';

  return fetch(`https://restcountries.com/v3.1/name/${value}${options}`);
};
