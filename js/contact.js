const phoneInputField = document.querySelector("#phone-number");

const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "us",
    separateDialCode: true,
    autoPlaceholder: "aggressive",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

let isCountryCodeAdded = false;

phoneInputField.addEventListener('input', function () {

    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);
    
    if (!isCountryCodeAdded && this.value.length > 0) {

        const countryData = phoneInput.getSelectedCountryData();
        
        if (this.value.length === 1) {
            this.value = '+' + countryData.dialCode + this.value;
            isCountryCodeAdded = true;
        }
    }
});

phoneInputField.addEventListener('focus', function() {
    if (this.value.length === 0) {
        isCountryCodeAdded = false;
    }
});

$(document).ready(function() {
    $('#submitButton').on("click", function() {
        $('.plane').addClass('fly');
        $('.hidden').addClass('visible');
        $('.replace').removeClass('fa-paper-plane').addClass('fa-check');
        $('span').text('SENT').hide();
        $(this).addClass('done');
    });
});