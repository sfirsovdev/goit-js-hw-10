import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import API from './fetchCountries';


const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    infoCountry: document.querySelector('.country-info'),
}

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(event) {
    event.preventDefault();

    const name = event.target.value.trim(); 

    if (!name) {
        refsCountry()
        return
    }
    
    API.fetchCountry(name)
        .then(renderCountryList)
        .catch(error)
}

function renderCountryList(response) {
        
    if (response.length >= 2 && response.length <= 10) {
        //const markup = response.map(country => countryNameFlag(country));
        createMarkup(response, countryNameFlag, refs.listCountry);
        refs.infoCountry.innerHTML = '';
        //refs.listCountry.innerHTML = markup.join('');
        
    } else if (response.length === 1) {
        //const markup = response.map(country => countryCardInfo(country));
        createMarkup(response, countryCardInfo, refs.infoCountry);
        //refs.infoCountry.innerHTML = markup.join('');
        refs.listCountry.innerHTML = '';
    } else {
        Notify.info("Too many matches found. Please enter a more specific name.")
        refsCountry();
    }
}

function createMarkup(data, template, ref) {
    const markup = data.map(country => template(country)).join('');
    ref.innerHTML = markup
    return
}

function refsCountry() {
    refs.infoCountry.innerHTML = '';
    refs.listCountry.innerHTML = '';
}

function error() {
    Notify.failure("Oops, there is no country with that name")
    refsCountry()
    return error;
}


function countryCardInfo({capital, population, languages}) {
    return `<ul class="country-info_list">
    <li class="country-info__card"><p><b>Capital: </b>${capital}</p></li>
    <li class="country-info__card"><p><b>Population: </b>${population}</p></li>
    <li class="country-info__card"><p><b>Languages: </b>${Object.values(languages)}</p></li>
    </ul>`
}

function countryNameFlag({ flags, name }) {
    return `<li class="country-list__item">
    <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width = 30px haight = 30px/>
    <h1 class="country-list__name">${name.official}</h1>
    </li>`
}