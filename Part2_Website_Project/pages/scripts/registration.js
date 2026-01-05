/**
 * Registration Validation Module
 * Provides validation functions for registration form
 * 
 * Responsibilities:
 * - Validate form inputs
 * - Password strength validation
 * - Email format validation
 */

// ============================================================================
// DOM Element References
// ============================================================================

const registrationForm = document.getElementById("registrationForm");
const fullNameInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const eventSelect = document.querySelector("select[name='event']");
const governorateSelect = document.querySelector("select[name='governorate']");
const termsCheckbox = document.getElementById("acceptTerms");

// ============================================================================
// Validation Functions Module (Single Responsibility: input validation)
// ============================================================================

/**
 * Checks if text is empty
 * @param {string} text - Text to check
 * @returns {boolean} True if text is empty
 */
function isTextEmpty(text) {
  return text.trim() === "";
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isEmailValid(email) {
  return email.includes("@") && email.includes(".");
}

/**
 * Validates password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 * @param {string} password - Password to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
function validatePasswordStrength(password) {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
  }
  
  return null; // Password is valid
}

/**
 * Checks if terms are accepted
 * @param {HTMLInputElement} checkboxElement - Terms checkbox element
 * @returns {boolean} True if terms are accepted
 */
function isTermsAccepted(checkboxElement) {
  return checkboxElement && checkboxElement.checked;
}

// ============================================================================
// Validation Result Module (Single Responsibility: validation results)
// ============================================================================

/**
 * Validates complete registration form
 * @returns {Object} Validation result with valid flag and optional message
 */
function validateRegistrationForm() {
  if (!registrationForm) {
    return { valid: true };
  }
  
  const currentName = fullNameInput ? fullNameInput.value : '';
  const currentEmail = emailInput ? emailInput.value : '';
  const currentPassword = passwordInput ? passwordInput.value : '';
  const currentGovernorate = governorateSelect ? governorateSelect.value : '';
  const currentEvent = eventSelect ? eventSelect.value : '';

  // Validate name
  if (isTextEmpty(currentName)) {
    return { valid: false, message: "Please enter your Full Name." };
  }

  // Validate email
  if (!isEmailValid(currentEmail)) {
    return { valid: false, message: "Please enter a valid Email Address." };
  }

  // Validate password
  const passwordError = validatePasswordStrength(currentPassword);
  if (passwordError) {
    return { valid: false, message: passwordError };
  }

  // Validate governorate
  if (!currentGovernorate || currentGovernorate === '') {
    return { valid: false, message: "Please select your Governorate." };
  }

  // Validate terms
  if (!isTermsAccepted(termsCheckbox)) {
    return { valid: false, message: "You must accept the Terms and Privacy Policy." };
  }

  return { valid: true };
}
