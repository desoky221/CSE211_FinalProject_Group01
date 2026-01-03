
const registrationForm = document.getElementById("registrationForm");

const fullNameInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const eventSelect = document.querySelector("select[name='event']");
const governorateSelect = document.querySelector("select[name='governorate']");
const termsCheckbox = document.getElementById("acceptTerms");


function isTextEmpty(text) {
    return text.trim() === "";
}

function isEmailValid(email) {
    return email.includes("@") && email.includes(".");
}

function isPasswordShort(password) {
    return password.length < 6;
}

function isEventSelected(selectedValue) {
    showErrorMessage("Please select an Event from the list.");
    return;
}

function isTermsAccepted(checkboxElement) {
    return checkboxElement.checked;
}

function showErrorMessage(message) {
    alert("Error: " + message);
}

function isGovernorateSelected(selectedValue) {
    showErrorMessage("Please select your Governorate.");
    return;
}

function showSuccessMessage() {
    alert("Success Your registration is complete.");
}

function handleFormSubmission(event) {
    event.preventDefault();

    const currentName = fullNameInput.value;
    const currentEmail = emailInput.value;
    const currentPassword = passwordInput.value;
    const currentGovernorate = governorateSelect.value;
    const currentEvent = eventSelect.value;

    if (isTextEmpty(currentName)) {
        showErrorMessage("Please enter your Full Name.");
        return;
    }

    if (!isEmailValid(currentEmail)) {
        showErrorMessage("Please enter a valid Email Address.");
        return;
    }

    if (isPasswordShort(currentPassword)) {
        showErrorMessage("Password must be at least 6 characters long.");
        return;
    }

    if (!isEventSelected(currentEvent)) {
        showErrorMessage("Please select an Event from the list.");
        return;
    }

    if (!isTermsAccepted(termsCheckbox)) {
        showErrorMessage("You must accept the Terms and Privacy Policy.");
        return;
    }

    if (!isGovernorateSelected(currentGovernorate)) {
        showErrorMessage("Please select your Governorate.");
        return;
    }

    showSuccessMessage();

    registrationForm.submit();
}

registrationForm.addEventListener("submit", handleFormSubmission);