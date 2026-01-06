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
 * File: pages/scripts/auth.js
 * Description: Authentication Module
 * Handles user authentication, form submissions, password visibility toggling, and token management
 */

const API_URL = 'http://localhost:3000/api/auth';

// ============================================================================
// Authentication Storage Module (Single Responsibility: localStorage operations)
// ============================================================================

/**
 * Stores authentication token in localStorage
 * @param {string} token - JWT authentication token
 */
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Retrieves authentication token from localStorage
 * @returns {string|null} Authentication token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Retrieves current user data from localStorage
 * @returns {Object|null} User object or null if not found
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Stores current user data in localStorage
 * @param {Object} user - User object to store
 */
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Clears all authentication data from localStorage
 */
function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

/**
 * Checks if user is currently authenticated
 * @returns {boolean} True if user has valid token
 */
function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Checks if current user has admin role
 * @returns {boolean} True if user is admin
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Generates authentication headers for API requests
 * @returns {Object} Headers object with Content-Type and Authorization
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// ============================================================================
// Password Toggle UI Module (Single Responsibility: password visibility)
// ============================================================================

/**
 * Toggles password input visibility and updates icon
 * @param {HTMLInputElement} passwordInput - Password input element
 * @param {HTMLElement} toggleButton - Toggle button element
 */
function togglePasswordVisibility(passwordInput, toggleButton) {
  const isCurrentlyPassword = passwordInput.getAttribute('type') === 'password';
  const newType = isCurrentlyPassword ? 'text' : 'password';
  
  passwordInput.setAttribute('type', newType);
  
  if (newType === 'text') {
    passwordInput.classList.add('password-visible');
  } else {
    passwordInput.classList.remove('password-visible');
  }
  
  const eyeIcon = toggleButton.querySelector('.eye-icon');
  if (eyeIcon) {
    eyeIcon.textContent = newType === 'text' ? '🙈' : '👁️';
  }
}

/**
 * Initializes password toggle functionality for a specific input
 * @param {string} inputId - ID of password input element
 * @param {string} toggleId - ID of toggle button element
 */
function initializePasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = document.getElementById(toggleId);
  
  if (passwordInput && toggleButton) {
    toggleButton.addEventListener('click', () => {
      togglePasswordVisibility(passwordInput, toggleButton);
    });
  }
}

/**
 * Initializes all password toggle functionality on page load
 */
function initPasswordToggle() {
  initializePasswordToggle('loginPassword', 'loginPasswordToggle');
  initializePasswordToggle('registrationPassword', 'registrationPasswordToggle');
}

// ============================================================================
// Form UI Helper Module (Single Responsibility: form state management)
// ============================================================================

/**
 * Updates submit button state during form processing
 * @param {HTMLButtonElement} button - Submit button element
 * @param {boolean} isProcessing - Whether form is being processed
 * @param {string} processingText - Text to show during processing
 * @param {string} defaultText - Default button text
 * @param {boolean} useInnerHTML - Whether to use innerHTML instead of textContent
 */
function updateSubmitButtonState(button, isProcessing, processingText, defaultText, useInnerHTML = false) {
  button.disabled = isProcessing;
  if (useInnerHTML) {
    button.innerHTML = isProcessing ? processingText : defaultText;
  } else {
    button.textContent = isProcessing ? processingText : defaultText;
  }
}

/**
 * Displays a message in the form message container
 * @param {HTMLElement} messageContainer - Message container element
 * @param {string} message - Message text to display
 * @param {string} type - Message type: 'success' or 'error'
 */
function displayFormMessage(messageContainer, message, type) {
  messageContainer.className = `form-message ${type}`;
  messageContainer.textContent = message;
  messageContainer.style.display = 'block';
}

/**
 * Hides the form message container
 * @param {HTMLElement} messageContainer - Message container element
 */
function hideFormMessage(messageContainer) {
  messageContainer.style.display = 'none';
}

/**
 * Ensures message container exists, creates if missing
 * @param {HTMLElement} form - Form element
 * @param {string} containerId - ID of message container
 * @param {HTMLElement} insertBefore - Element to insert before
 * @returns {HTMLElement} Message container element
 */
function ensureMessageContainer(form, containerId, insertBefore) {
  let messageContainer = document.getElementById(containerId);
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = containerId;
    messageContainer.className = 'form-message';
    form.insertBefore(messageContainer, insertBefore);
  }
  return messageContainer;
}

// ============================================================================
// API Communication Module (Single Responsibility: HTTP requests)
// ============================================================================

/**
 * Handles API response errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} Error data object
 */
async function handleApiError(response) {
  try {
    const errorData = await response.json();
    return { message: errorData.message || `HTTP error! status: ${response.status}` };
  } catch {
    return { message: 'Network error' };
  }
}

/**
 * Makes login API request
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} API response data
 */
async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const errorData = await handleApiError(response);
    throw new Error(errorData.message);
  }
  
  return await response.json();
}

/**
 * Makes registration API request
 * @param {Object} formData - Registration form data
 * @returns {Promise<Object>} API response data
 */
async function registerUser(formData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  return await response.json();
}

// ============================================================================
// Navigation Module (Single Responsibility: redirects)
// ============================================================================

/**
 * Determines redirect path based on user role
 * @param {string} userRole - User role ('admin' or 'student')
 * @returns {string} Redirect path
 */
function getRedirectPathByRole(userRole) {
  return userRole === 'admin' ? 'events.html' : 'student-dashboard.html';
}

/**
 * Redirects user after successful authentication
 * @param {string} userRole - User role
 * @param {number} delay - Delay in milliseconds before redirect
 */
function redirectAfterAuth(userRole, delay = 1000) {
  setTimeout(() => {
    const redirectPath = getRedirectPathByRole(userRole);
    window.location.href = redirectPath;
  }, delay);
}

// ============================================================================
// Form Validation Module (Single Responsibility: input validation)
// ============================================================================

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  return email && email.includes('@') && email.includes('.');
}

/**
 * Validates registration form data
 * @param {Object} formData - Form data object
 * @param {HTMLInputElement} passwordInput - Password input element
 * @param {HTMLInputElement} termsCheckbox - Terms checkbox element
 * @returns {string|null} Error message or null if valid
 */
function validateRegistrationForm(formData, passwordInput, termsCheckbox) {
  if (!formData.name || formData.name.trim() === '') {
    return 'Please enter your Full Name.';
  }
  
  if (!isValidEmail(formData.email)) {
    return 'Please enter a valid Email Address.';
  }
  
  if (!passwordInput || !formData.password || formData.password.trim() === '') {
    return 'Password is required';
  }
  
  if (typeof validatePasswordStrength === 'function') {
    const passwordError = validatePasswordStrength(formData.password);
    if (passwordError) {
      return passwordError;
    }
  }
  
  if (!formData.governorate || formData.governorate === '') {
    return 'Please select your Governorate.';
  }
  
  if (!termsCheckbox || !termsCheckbox.checked) {
    return 'You must accept the Terms and Privacy Policy.';
  }
  
  return null;
}

// ============================================================================
// Form Submission Handlers (Single Responsibility: form event handling)
// ============================================================================

/**
 * Handles successful login response
 * @param {Object} result - API response result
 * @param {HTMLElement} messageContainer - Message container element
 */
function handleLoginSuccess(result, messageContainer) {
  setAuthToken(result.data.token);
  setCurrentUser(result.data.user);
  
  const userRole = result.data.user?.role || getCurrentUser()?.role;
  displayFormMessage(messageContainer, 'Login successful! Redirecting...', 'success');
  redirectAfterAuth(userRole);
}

/**
 * Handles login form submission
 */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageContainer = document.getElementById('loginMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton.textContent;
    
    hideFormMessage(messageContainer);
    updateSubmitButtonState(submitButton, true, 'Signing in...', defaultButtonText);
    
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        handleLoginSuccess(result, messageContainer);
      } else {
        displayFormMessage(messageContainer, result.message || 'Login failed. Please check your credentials.', 'error');
        updateSubmitButtonState(submitButton, false, 'Signing in...', defaultButtonText);
      }
    } catch (error) {
      displayFormMessage(messageContainer, error.message || 'Failed to connect to server. Please try again.', 'error');
      updateSubmitButtonState(submitButton, false, 'Signing in...', defaultButtonText);
    }
  });
}

/**
 * Extracts form data from registration form
 * @returns {Object} Form data object
 */
function extractRegistrationFormData() {
  const nameInput = document.querySelector('input[type="text"]');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.getElementById('registrationPassword');
  const governorateSelect = document.querySelector('select[name="governorate"]');
  
  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    password: passwordInput ? passwordInput.value : '',
    governorate: governorateSelect ? governorateSelect.value : ''
  };
}

/**
 * Handles successful registration response
 * @param {Object} result - API response result
 * @param {HTMLElement} messageContainer - Message container element
 */
function handleRegistrationSuccess(result, messageContainer) {
  setAuthToken(result.data.token);
  setCurrentUser(result.data.user);
  
  displayFormMessage(messageContainer, 'Account created successfully! Redirecting...', 'success');
  redirectAfterAuth('student', 1000);
}

/**
 * Handles registration form submission
 */
function initRegistrationForm() {
  const registrationForm = document.getElementById('registrationForm');
  if (!registrationForm) return;
  
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton.innerHTML;
    const passwordInput = document.getElementById('registrationPassword');
    const termsCheckbox = document.getElementById('acceptTerms');
    
    const formData = extractRegistrationFormData();
    const messageContainer = ensureMessageContainer(
      registrationForm,
      'signupMessage',
      submitButton
    );
    
    hideFormMessage(messageContainer);
    
    const validationError = validateRegistrationForm(formData, passwordInput, termsCheckbox);
    if (validationError) {
      displayFormMessage(messageContainer, validationError, 'error');
      return;
    }
    
    updateSubmitButtonState(submitButton, true, 'Creating account...', defaultButtonText, true);
    
    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        handleRegistrationSuccess(result, messageContainer);
      } else {
        displayFormMessage(messageContainer, result.message || 'Registration failed. Please try again.', 'error');
        updateSubmitButtonState(submitButton, false, 'Creating account...', defaultButtonText, true);
      }
    } catch (error) {
      displayFormMessage(messageContainer, 'Failed to connect to server. Please try again.', 'error');
      updateSubmitButtonState(submitButton, false, 'Creating account...', defaultButtonText, true);
    }
  });
}

// ============================================================================
// Module Initialization
// ============================================================================

/**
 * Initializes all authentication-related functionality
 */
function initializeAuthModule() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPasswordToggle();
      initLoginForm();
      initRegistrationForm();
    });
  } else {
    initPasswordToggle();
    initLoginForm();
    initRegistrationForm();
  }
}

// Initialize module
initializeAuthModule();
