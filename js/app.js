// Function to remove specified currencies
const removeCurrencies = (data, currencies) => {
  Object.keys(data).forEach(key => {
    if (data[key].hasOwnProperty('supported_digital_currencies')) {
      data[key].supported_digital_currencies = data[key].supported_digital_currencies.filter(currency => !currencies.includes(currency));
    }
  });
  return data;
};

// Function to add specified currencies
const addCurrencies = (data, currencies) => {
  Object.keys(data).forEach(key => {
    if (data[key].hasOwnProperty('supported_digital_currencies') && data[key].probability > 0) {
      data[key].supported_digital_currencies = [...new Set([...data[key].supported_digital_currencies, ...currencies])];
    }
  });
  return data;
};

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const affiliatesInput = document.getElementById('affiliates').value;
  const removeChecked = document.getElementById('removeChecked').checked;
  const addChecked = document.getElementById('addChecked').checked;

  try {
    let affiliates = JSON.parse(affiliatesInput);
    const currenciesToRemove = removeChecked ? JSON.parse(document.getElementById('currenciesToRemove').value) : [];
    const currenciesToAdd = addChecked ? JSON.parse(document.getElementById('currenciesToAdd').value) : [];

    if (removeChecked) {
      affiliates = removeCurrencies(affiliates, currenciesToRemove);
    }
    if (addChecked) {
      affiliates = addCurrencies(affiliates, currenciesToAdd);
    }

    document.getElementById('result').textContent = JSON.stringify(affiliates, null, 2);
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
  document.getElementById('currenciesToRemove').disabled = !removeChecked;
  document.getElementById('currenciesToAdd').disabled = !addChecked;
  document.getElementById('updateCurrencies').disabled = !(removeChecked || addChecked);
}

// Initialize input fields and "Update Currencies" button state
window.addEventListener('DOMContentLoaded', () => {
  toggleInputFields();
});
