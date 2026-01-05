/**
 * Profile Management Module
 * Handles user profile editing and updates
 * 
 * Responsibilities:
 * - Load and display user profile data
 * - Handle profile picture upload
 * - Update profile information via API
 */

const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_API_URL = `${API_BASE_URL}/auth`;

// ============================================================================
// Authentication Module (Single Responsibility: auth operations)
// ============================================================================

/**
 * Retrieves authentication token from localStorage
 * @returns {string|null} Authentication token
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Retrieves current user from localStorage
 * @returns {Object|null} User object
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Stores current user in localStorage
 * @param {Object} user - User object to store
 */
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Generates authentication headers for API requests
 * @returns {Object} Headers object
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Checks if user is authenticated, redirects to login if not
 * @returns {boolean} True if authenticated
 */
function checkAuth() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ============================================================================
// Date Formatting Module (Single Responsibility: date operations)
// ============================================================================

/**
 * Formats date for input field (YYYY-MM-DD)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string or empty string
 */
function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// ============================================================================
// Profile Data Loading Module (Single Responsibility: data fetching)
// ============================================================================

/**
 * Handles authentication errors
 * @param {number} status - HTTP status code
 */
function handleAuthError(status) {
  if (status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

/**
 * Populates form fields with user data
 * @param {Object} user - User object
 */
function populateFormFields(user) {
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const birthdayInput = document.getElementById('profileBirthday');
  const genderInput = document.getElementById('profileGender');
  const phoneInput = document.getElementById('profilePhone');
  
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (birthdayInput) birthdayInput.value = formatDateForInput(user.birthday);
  if (genderInput) genderInput.value = user.gender || '';
  if (phoneInput) phoneInput.value = user.phoneNumber || '';
}

/**
 * Updates profile picture preview
 * @param {string} imageUrl - Image URL or base64 string
 */
function updateProfilePicturePreview(imageUrl) {
  const profilePicturePreview = document.getElementById('profilePicturePreview');
  if (!profilePicturePreview) return;
  
  if (imageUrl) {
    profilePicturePreview.src = imageUrl;
    profilePicturePreview.style.display = 'block';
  } else {
    profilePicturePreview.style.display = 'none';
  }
}

/**
 * Loads user profile data from API
 */
async function loadProfile() {
  if (!checkAuth()) return;

  try {
    const response = await fetch(`${AUTH_API_URL}/me`, {
      headers: getAuthHeaders()
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const user = result.data;
        populateFormFields(user);
        updateProfilePicturePreview(user.profilePicture);
      }
    } else {
      handleAuthError(response.status);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// ============================================================================
// File Handling Module (Single Responsibility: file operations)
// ============================================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates uploaded file
 * @param {File} file - File object to validate
 * @returns {string|null} Error message or null if valid
 */
function validateFile(file) {
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'Image size should be less than 5MB';
  }
  
  return null;
}

/**
 * Converts image file to base64 string
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} Base64 string
 */
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    
    reader.readAsDataURL(file);
  });
}

/**
 * Sets up profile picture upload functionality
 */
function setupProfilePictureUpload() {
  const profilePictureInput = document.getElementById('profilePictureInput');
  const profilePicturePreview = document.getElementById('profilePicturePreview');
  
  if (!profilePictureInput || !profilePicturePreview) return;
  
  profilePictureInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    try {
      const base64String = await imageToBase64(file);
      updateProfilePicturePreview(base64String);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading image file');
    }
  });
}

// ============================================================================
// Form Submission Module (Single Responsibility: form handling)
// ============================================================================

/**
 * Extracts form data from profile form
 * @returns {Object} Form data object
 */
function extractFormData() {
  return {
    name: document.getElementById('profileName').value.trim(),
    birthday: document.getElementById('profileBirthday').value || null,
    gender: document.getElementById('profileGender').value || null,
    phoneNumber: document.getElementById('profilePhone').value.trim() || null
  };
}

/**
 * Updates submit button state
 * @param {HTMLElement} button - Submit button element
 * @param {boolean} isProcessing - Whether form is being processed
 * @param {string} processingText - Text to show during processing
 * @param {string} defaultText - Default button text
 */
function updateSubmitButtonState(button, isProcessing, processingText, defaultText) {
  button.disabled = isProcessing;
  button.innerHTML = isProcessing ? processingText : defaultText;
}

/**
 * Displays message to user
 * @param {HTMLElement} messageDiv - Message container element
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(messageDiv, message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = 'block';
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Updates profile via API
 * @param {Object} formData - Form data object
 * @param {HTMLElement} messageDiv - Message container element
 * @param {HTMLElement} submitButton - Submit button element
 * @param {string} originalButtonText - Original button text
 */
async function updateProfile(formData, messageDiv, submitButton, originalButtonText) {
  try {
    const response = await fetch(`${AUTH_API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Update local storage with new user data
      const updatedUser = result.data;
      setCurrentUser({
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
      
      // Update profile icon in navigation
      if (window.updateProfileIcon) {
        await window.updateProfileIcon();
      }
      
      showMessage(messageDiv, 'Profile updated successfully!', 'success');
      updateSubmitButtonState(submitButton, false, 'Saving...', originalButtonText);
    } else {
      showMessage(messageDiv, result.message || 'Failed to update profile', 'error');
      updateSubmitButtonState(submitButton, false, 'Saving...', originalButtonText);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage(messageDiv, 'Failed to connect to server. Please try again.', 'error');
    updateSubmitButtonState(submitButton, false, 'Saving...', originalButtonText);
  }
}

/**
 * Sets up profile form submission
 */
function setupFormSubmission() {
  const profileForm = document.getElementById('profileForm');
  const profileMessage = document.getElementById('profileMessage');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const profilePictureInput = document.getElementById('profilePictureInput');
  
  if (!profileForm || !profileMessage || !saveProfileBtn) return;
  
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const originalButtonText = saveProfileBtn.innerHTML;
    updateSubmitButtonState(saveProfileBtn, true, 'Saving...', originalButtonText);
    profileMessage.style.display = 'none';
    
    try {
      const formData = extractFormData();
      
      // Handle profile picture if changed
      if (profilePictureInput && profilePictureInput.files.length > 0) {
        const file = profilePictureInput.files[0];
        const validationError = validateFile(file);
        
        if (validationError) {
          showMessage(profileMessage, validationError, 'error');
          updateSubmitButtonState(saveProfileBtn, false, 'Saving...', originalButtonText);
          return;
        }
        
        try {
          const base64String = await imageToBase64(file);
          formData.profilePicture = base64String;
          await updateProfile(formData, profileMessage, saveProfileBtn, originalButtonText);
        } catch (error) {
          showMessage(profileMessage, 'Error reading profile picture', 'error');
          updateSubmitButtonState(saveProfileBtn, false, 'Saving...', originalButtonText);
        }
      } else {
        // No new picture, just update other fields
        await updateProfile(formData, profileMessage, saveProfileBtn, originalButtonText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showMessage(profileMessage, 'An error occurred. Please try again.', 'error');
      updateSubmitButtonState(saveProfileBtn, false, 'Saving...', originalButtonText);
    }
  });
}

// ============================================================================
// Module Initialization
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  setupProfilePictureUpload();
  setupFormSubmission();
});
