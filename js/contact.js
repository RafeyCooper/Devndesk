const phoneInputField = document.querySelector("#phone-number");

const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "us", // Set the initial country code
    separateDialCode: true, // Show separate dial code
    autoPlaceholder: "aggressive", // Automatically add placeholder
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", // For validation and formatting
});

// Keep track of whether the country code has been added
let isCountryCodeAdded = false;

phoneInputField.addEventListener('input', function () {
    // Remove any non-digit characters and limit to 15 characters
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);

    // Check if the input is empty and the country code is not added yet
    if (!isCountryCodeAdded && this.value.length > 0) {
        // Get the selected country data
        const countryData = phoneInput.getSelectedCountryData();
        
        // Prepend the country code with the plus sign only when user starts typing
        if (this.value.length === 1) {
            this.value = '+' + countryData.dialCode + this.value; // Prepend the country code
            isCountryCodeAdded = true; // Set the flag to true
        }
    }
});

// Handle the focus event
phoneInputField.addEventListener('focus', function() {
    // Reset the flag if the input is empty
    if (this.value.length === 0) {
        isCountryCodeAdded = false; // Allow adding country code again
    }
});