const countryContainer = document.querySelector(".country-details-container");
const backBtn = document.querySelector(".back-btn");
const darkModeBtn = document.getElementById("mode");
const body = document.querySelector("body");

const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get("code");

async function fetchCountryDetails() {
  if (!countryCode) {
    countryContainer.innerHTML = "<h2>Country not found</h2>";
    return;
  }
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    const countries = await response.json();
    if (countries.status === 404 || !countries[0]) {
      countryContainer.innerHTML = "<h2>Country not found</h2>";
    } else {
      displayCountryDetails(countries[0]);
    }
  } catch (error) {
    console.log(error);
  }
}

async function displayCountryDetails(country) {
  countryContainer.innerHTML = `
<div class="country-details-section">
          <div class="country-flag">
            <img src="${country.flags.svg}" alt="${country.name.common} Flag" />
          </div>
          <div class="country-info-box">
            <h2 class="country-name"> ${country.name.common}</h2>
            <div class="country-info">
              <div class="country-info-left">
                <p><strong>Native Name:</strong> ${
                  Object.values(country.name.nativeName)[0].common
                }</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Sub Region:</strong> ${country.subregion}</p>
                <p><strong>Capital:</strong> ${
                  country.capital?.[0] || "No capital"
                }</p>
              </div>
              <div class="country-info-right">
                <p><strong>Top Level Domain:</strong> ${country.tld.join(
                  ", "
                )}</p>
                <p><strong>Currencies:</strong> ${
                  country.currencies
                    ? Object.values(country.currencies)[0].name
                    : "No currency"
                }</p>
                <p><strong>Languages:</strong> ${
                  country.languages
                    ? Object.values(country.languages).join(", ")
                    : "No language"
                }</p>
              </div>
            </div>
            <div class="border-countries">
              <p>Border Countries:</p>
              <div class="border-countries-container">
              </div>
            </div>
        </div>
`;
  fetchBorderCountries(country.borders);
}

// Fetch border countries
async function fetchBorderCountries(borderCodes) {
  const borderCountriesContainer = document.querySelector(
    ".border-countries-container"
  );

  if (!borderCodes || borderCodes.length === 0) {
    borderCountriesContainer.innerHTML = "<p>No border countries</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`
    );
    const borderCountries = await response.json();

    borderCountries.forEach((borderCountry) => {
      const borderEl = document.createElement("span");
      borderEl.textContent = borderCountry.name.common;
      borderEl.classList.add("border-country");
      borderEl.dataset.code = borderCountry.cca2;
      borderEl.addEventListener("click", () => {
        window.location.href = `single_country.html?code=${borderCountry.cca2}`;
      });
      borderCountriesContainer.appendChild(borderEl);
    });
  } catch (error) {
    console.log("Error fetching border countries:", error);
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

// To move back
backBtn.addEventListener("click", () => {
  window.history.back();
});

fetchCountryDetails();
