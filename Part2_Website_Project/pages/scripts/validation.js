/**
 * CSE211 Web Programming - Fall 2025-2026
 * Final Course Project - Group 01
 * EventsX - Dynamic Responsive Event Planner Web Application
 * 
 * Team Members:
 * - Ibrahim Hassan - 223104567
 * - George Karm Hosney Fayz - 223106365
 * - Youssef Ahmed Ibrahim - 223101109
 * - Abdallah Mostafa Mahdy - 223104683
 * 
 * File: pages/scripts/validation.js
 * Description: Form Validation Module
 * Provides comprehensive form validation utilities
 * 
 * Responsibilities:
 * - Validate various input types
 * - Display error messages
 * - Clear error states
 * - Real-time validation feedback
 */

// ============================================================================
// Module Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
      if (!validateRegistrationForm()) {
        event.preventDefault();
      }
    });
  }

  const budgetForm = document.getElementById('budgetForm');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (event) => {
      if (!validateBudgetForm()) {
        event.preventDefault();
      }
    });
  }
});

// ============================================================================
// Validation Functions Module (Single Responsibility: input validation)
// ============================================================================

/**
 * Validates name (must not be empty and at least 2 characters)
 * @param {string} name - Name to validate
 * @returns {boolean} True if name is valid
 */
function validateName(name) {
  return name && name.trim().length >= 2;
}

/**
 * Validates email format using regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
  if (!email) {
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validates password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 * @param {string} password - Password to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
function validatePassword(password) {
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
 * Validates select field (must have a value selected)
 * @param {string} value - Selected value
 * @returns {boolean} True if value is selected
 */
function validateSelect(value) {
  return value && value !== '';
}

/**
 * Validates number input (must be a valid number and >= 0)
 * @param {string|number} value - Value to validate
 * @returns {boolean} True if number is valid
 */
function validateNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return true; // Empty is allowed for optional fields
  }
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

// ============================================================================
// Error Display Module (Single Responsibility: error UI)
// ============================================================================

/**
 * Shows error message for an input field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message to display
 */
function showError(input, message) {
  // Remove any existing error
  clearError(input);

  // Add error class to input
  input.classList.add('error');

  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = 'red';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';

  // Insert error message after input
  input.parentNode.appendChild(errorDiv);
}

/**
 * Clears error message for an input field
 * @param {HTMLElement} input - Input element
 */
function clearError(input) {
  // Remove error class
  input.classList.remove('error');

  // Remove error message if it exists
  const errorDiv = input.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// ============================================================================
// Form Validation Module (Single Responsibility: form validation)
// ============================================================================

/**
 * Validates registration form
 * @returns {boolean} True if form is valid
 */
function validateRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) {
    return true;
  }

  let isValid = true;

  // Get form inputs
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const selectInput = form.querySelector('select');
  const checkboxInput = document.getElementById('acceptTerms');

  // Validate name
  if (nameInput) {
    if (!validateName(nameInput.value)) {
      showError(nameInput, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(nameInput);
    }
  }

  // Validate email
  if (emailInput) {
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }
  }

  // Validate password
  if (passwordInput) {
    const passwordError = validatePassword(passwordInput.value);
    if (passwordError) {
      showError(passwordInput, passwordError);
      isValid = false;
    } else {
      clearError(passwordInput);
    }
  }

  // Validate select (event selection)
  if (selectInput) {
    if (!validateSelect(selectInput.value)) {
      showError(selectInput, 'Please select an event');
      isValid = false;
    } else {
      clearError(selectInput);
    }
  }

  // Validate checkbox (terms acceptance)
  if (checkboxInput) {
    if (!checkboxInput.checked) {
      showError(checkboxInput, 'You must agree to the Terms of Service and Privacy Policy');
      isValid = false;
    } else {
      clearError(checkboxInput);
    }
  }

  return isValid;
}

/**
 * Validates budget calculator form
 * @returns {boolean} True if form is valid
 */
function validateBudgetForm() {
  const form = document.getElementById('budgetForm');
  if (!form) {
    return true;
  }

  let isValid = true;

  // Get number inputs
  const ticketCost = document.getElementById('ticketCost');
  const transportCost = document.getElementById('transportCost');
  const materialsCost = document.getElementById('materialsCost');
  const foodCost = document.getElementById('foodCost');

  // Validate all number inputs
  const numberInputs = [ticketCost, transportCost, materialsCost, foodCost];
  
  numberInputs.forEach(input => {
    if (input) {
      if (!validateNumber(input.value)) {
        showError(input, 'Please enter a valid number (0 or greater)');
        isValid = false;
      } else {
        clearError(input);
      }
    }
  });

  return isValid;
}
