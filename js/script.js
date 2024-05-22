// Function to update currencies or countries for specific affiliates
const updateAffiliates = (affiliates, affiliateList, updateFunc) => {
  affiliateList.forEach(key => {
    if (affiliates.hasOwnProperty(key)) {
      affiliates[key] = updateFunc(affiliates[key]);
    }
  });
  return affiliates;
};

// Function to update the probability for specified affiliates
const updateProbabilities = (affiliates, affiliateList) => {
  affiliateList.forEach(key => {
    if (affiliates.hasOwnProperty(key) && affiliates[key].hasOwnProperty('probability')) {
      if (affiliates[key].probability === 0) {
        affiliates[key].probability = 0.01;
      }
    }
  });
  return affiliates;
};

// Function to remove specified currencies
const removeCurrencies = (affiliate, currencies) => {
  if (affiliate.hasOwnProperty('supported_digital_currencies')) {
    affiliate.supported_digital_currencies = affiliate.supported_digital_currencies.filter(currency => !currencies.includes(currency));
  }
  return affiliate;
};

// Function to add specified currencies
const addCurrencies = (affiliate, currencies) => {
  if (!affiliate.hasOwnProperty('supported_digital_currencies')) {
    affiliate.supported_digital_currencies = [];
  }
  const existingCurrencies = new Set(affiliate.supported_digital_currencies);
  currencies.forEach(currency => existingCurrencies.add(currency));
  affiliate.supported_digital_currencies = Array.from(existingCurrencies);
  return affiliate;
};

// Function to add specified countries to supported countries
const addCountries = (affiliate, countries) => {
  if (!affiliate.hasOwnProperty('supported_countries')) {
    affiliate.supported_countries = [];
  }
  const existingCountries = new Set(affiliate.supported_countries);
  countries.forEach(country => existingCountries.add(country));
  affiliate.supported_countries = Array.from(existingCountries);
  return affiliate;
};

// Function to remove specified countries from supported countries
const removeCountries = (affiliate, countries) => {
  if (affiliate.hasOwnProperty('supported_countries') && JSON.stringify(affiliate.supported_countries) !== JSON.stringify(["base_countries"])) {
    affiliate.supported_countries = affiliate.supported_countries.filter(country => !countries.includes(country));
  }
  return affiliate;
};

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const lpInput = document.getElementById('lpInput').value;
  const affiliatesInput = document.getElementById('affiliates').value;

  try {
    const lp = JSON.parse(lpInput);
    let affiliates = lp.affiliates;
    const affiliateList = affiliatesInput ? affiliatesInput.split(',').map(name => name.trim()) : Object.keys(affiliates);

    // Update probabilities if specified
    affiliates = updateProbabilities(affiliates, affiliateList);

    lp.affiliates = affiliates;
    document.getElementById('result').textContent = JSON.stringify(lp, null, 2);
    document.getElementById('copyResult').disabled = false;
  } catch (e) {
    document.getElementById('result').textContent = 'Invalid input. Please enter valid JSON for all fields.';
    document.getElementById('copyResult').disabled = true;
  }
}

// Function to copy result text to clipboard
function copyResult() {
  const resultText = document.getElementById('result').textContent;
  navigator.clipboard.writeText(resultText).then(() => {
    alert('Result copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy result:', err);
    alert('Failed to copy result. Please try again.');
  });
}

// Function to toggle input fields based on checkbox state 
function toggleInputFields() {
  const removeChecked = document.getElementById('removeChecked').checked;
  const addChecked = document.getElementById('addChecked').checked;
  const addCountriesChecked = document.getElementById('addCountriesChecked').checked;
  const removeCountriesChecked = document.getElementById('removeCountriesChecked').checked;
  const updateProbabilityChecked = document.getElementById('updateProbabilityChecked').checked;

  const currenciesToRemoveContainer = document.getElementById('currenciesToRemoveContainer');
  const currenciesToAddContainer = document.getElementById('currenciesToAddContainer');
  const countriesToAddContainer = document.getElementById('countriesToAddContainer');
  const countriesToRemoveContainer = document.getElementById('countriesToRemoveContainer');
  const updateAffiliatesButton = document.getElementById('updateAffiliates');

  currenciesToRemoveContainer.style.display = removeChecked ? "block" : "none";
  currenciesToAddContainer.style.display = addChecked ? "block" : "none";
  countriesToAddContainer.style.display = addCountriesChecked ? "block" : "none";
  countriesToRemoveContainer.style.display = removeCountriesChecked ? "block" : "none";

  updateAffiliatesButton.disabled = !(removeChecked || addChecked || addCountriesChecked || removeCountriesChecked || updateProbabilityChecked);
}

// Initialize input fields and "Update Affiliates" button state
toggleInputFields();

// Modal script
const modal = document.getElementById("howToUseModal");
const btn = document.getElementById("howToUseBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
