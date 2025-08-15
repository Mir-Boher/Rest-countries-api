const body = document.body;
const darkModeBtn = document.getElementById("mode");
const countriesSection = document.getElementById("countries-container");
const searchInput = document.getElementById("search-bar");
const regionFilter = document.getElementById("filter");

const COUNTRY_FIELDS = "name,capital,region,population,flags,cca2";
async function fetchCountries(
  url = `https://restcountries.com/v3.1/all?fields=${COUNTRY_FIELDS}`
) {
  try {
    const response = await fetch(url);
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    console.log(error);
  }
}

function displayCountries(countries) {
  countriesSection.innerHTML = "";
  countries.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("country-card");

    countryCard.innerHTML = `
  <img src="${country.flags.svg}" alt="${country.name.common} Flag" />
  <h2>${country.name.common}</h2>
  <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
  <p><strong>Region:</strong> ${country.region}</p>
  <p><strong>Capital:</strong> ${country.capital}</p>
  `;
    countryCard.addEventListener("click", () => {
      window.location.href = `single_country.html?code=${encodeURIComponent(
        country.cca2
      )}`;
      searchInput.value = "";
    });
    countriesSection.appendChild(countryCard);
  });
}

regionFilter.addEventListener("change", () => {
  const selectedRegion = regionFilter.value;
  if (selectedRegion) {
    fetchCountries(
      `https://restcountries.com/v3.1/region/${selectedRegion}?fields=${COUNTRY_FIELDS}`
    );
  } else {
    fetchCountries();
  }
});

searchInput.addEventListener("input", () => {
  regionFilter.value = "";
  if (searchInput.value.trim() == "") {
    countriesSection.innerHTML = "";
    fetchCountries();
  } else {
    searchCountry();
  }
});

async function searchCountry() {
  const search = searchInput.value.trim().toLowerCase();
  if (!search) return;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${search}?fields=${COUNTRY_FIELDS}`
    );
    const countries = await response.json();
    if (countries.status === 404) {
      countriesSection.innerHTML = `<h2>Country not found</h2>`;
    } else {
      countriesSection.innerHTML = "";
      displayCountries(countries);
    }
  } catch (error) {
    console.log(error);
  }
}

// Store the dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  darkModeBtn.textContent = "Light Mode";
}

// Dark mode
darkModeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    darkModeBtn.textContent = "Light Mode";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkModeBtn.textContent = "Dark Mode";
  }
});

fetchCountries();
