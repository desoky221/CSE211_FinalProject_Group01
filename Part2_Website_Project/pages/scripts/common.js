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
 * File: pages/scripts/common.js
 * Description: Common Utilities Module - Shared JavaScript utilities used across all pages
 * 
 * Responsibilities:
 * - UI initialization (copyright, navigation, smooth scroll)
 * - Profile dropdown management
 * - Authentication helpers
 * - Link security
 * - Navigation state management
 */

// ============================================================================
// Module Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  updateCopyrightYear();
  setActiveNavLink();
  enableSmoothScroll();
  secureExternalLinks();
  initProfileDropdown();
  toggleRegistrationLink();
  toggleSignInLinks();
});

// ============================================================================
// UI Utilities Module (Single Responsibility: UI updates)
// ============================================================================

/**
 * Updates copyright year automatically in all elements with .copyright-year class
 */
function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(element => {
    element.textContent = currentYear;
  });
}

/**
 * Highlights active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.navLink').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });
}

/**
 * Enables smooth scrolling for anchor links
 */
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('href');
      const targetElement = document.querySelector(targetSelector);
      
      if (!targetElement) return;
      
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Adds security attributes to external links (target="_blank" and rel="noopener noreferrer")
 */
function secureExternalLinks() {
  const currentHost = location.hostname;
  
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(currentHost)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

// ============================================================================
// Authentication Storage Module (Single Responsibility: localStorage operations)
// ============================================================================

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
 * Clears all authentication data from localStorage
 * Note: Calculator events are preserved as they are stored per-user
 */
function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

// ============================================================================
// Path Resolution Module (Single Responsibility: path calculations)
// ============================================================================

/**
 * Determines correct relative path based on current page location
 * @param {string} relativePath - Relative path to resolve
 * @returns {string} Corrected path based on current location
 */
function getCorrectPath(relativePath) {
  if (relativePath.startsWith('pages/')) {
    return relativePath;
  }
  
  const currentPath = window.location.pathname;
  const isInPagesFolder = currentPath.includes('/pages/');
  
  return isInPagesFolder ? relativePath : `pages/${relativePath}`;
}

/**
 * Determines login page path based on current location
 * @returns {string} Path to login page
 */
function getLoginPath() {
  const currentPath = window.location.pathname;
  const isInPagesFolder = currentPath.includes('/pages/');
  return isInPagesFolder ? 'login.html' : 'pages/login.html';
}

// ============================================================================
// Authentication Actions Module (Single Responsibility: auth operations)
// ============================================================================

/**
 * Signs out current user and redirects to login page
 */
function signOut() {
  clearAuth();
  const loginPath = getLoginPath();
  window.location.href = loginPath;
}

// Make signOut globally accessible to override any conflicting definitions
window.signOut = signOut;
setTimeout(() => {
  window.signOut = signOut;
}, 0);

// ============================================================================
// Profile Utilities Module (Single Responsibility: profile display)
// ============================================================================

/**
 * Generates user initials from name
 * @param {string} name - User's full name
 * @returns {string} Two-letter initials in uppercase
 */
function getInitials(name) {
  if (!name) return 'U';
  
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
}

/**
 * Updates profile icon element with user data
 * @param {HTMLElement} profileIcon - Profile icon container element
 * @param {Object} userData - User data object
 */
function updateProfileIconElement(profileIcon, userData) {
  if (!profileIcon) return;
  
  // Clear existing content
  profileIcon.textContent = '';
  profileIcon.classList.remove('has-image');
  
  // Remove existing image if any
  const existingImage = profileIcon.querySelector('img');
  if (existingImage) {
    existingImage.remove();
  }
  
  // Display profile picture or initials
  if (userData && userData.profilePicture) {
    const imageElement = document.createElement('img');
    imageElement.src = userData.profilePicture;
    imageElement.alt = 'Profile Picture';
    profileIcon.appendChild(imageElement);
    profileIcon.classList.add('has-image');
  } else {
    profileIcon.textContent = getInitials(userData?.name || 'U');
  }
}

// ============================================================================
// API Communication Module (Single Responsibility: HTTP requests)
// ============================================================================

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches current user data from API
 * @returns {Promise<Object|null>} User data or null on error
 */
async function fetchCurrentUserData() {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  
  return null;
}

// ============================================================================
// Profile Dropdown Module (Single Responsibility: dropdown management)
// ============================================================================

/**
 * Handles profile dropdown button clicks
 * @param {HTMLElement} dropdown - Dropdown container element
 * @param {string} action - Action type ('profile' or 'switch')
 */
function handleDropdownAction(dropdown, action) {
  if (action === 'switch') {
    dropdown.classList.remove('show');
    signOut();
  } else if (action === 'profile') {
    const profilePath = getCorrectPath('profile.html');
    window.location.href = profilePath;
  }
}

/**
 * Sets up event listeners for profile dropdown
 * @param {HTMLElement} profileContainer - Profile container element
 * @param {HTMLElement} profileIcon - Profile icon element
 * @param {HTMLElement} profileDropdown - Dropdown menu element
 */
function setupDropdownEventListeners(profileContainer, profileIcon, profileDropdown) {
  // Toggle dropdown on icon click
  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      profileDropdown.classList.toggle('show');
    });
    
    // Handle dropdown button clicks using event delegation
    profileDropdown.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      
      const action = button.getAttribute('data-action');
      event.preventDefault();
      event.stopPropagation();
      
      handleDropdownAction(profileDropdown, action);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }
  
  // Direct handlers as backup
  const profileButton = profileContainer.querySelector('[data-action="profile"]');
  const signOutButton = profileContainer.querySelector('[data-action="switch"]');
  
  if (profileButton) {
    profileButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const profilePath = getCorrectPath('profile.html');
      window.location.href = profilePath;
    });
  }
  
  if (signOutButton) {
    signOutButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      signOut();
    });
  }
}

/**
 * Creates global function to update profile icon (called from profile page)
 * @param {HTMLElement} profileIcon - Profile icon element
 */
function createGlobalProfileIconUpdater(profileIcon) {
  window.updateProfileIcon = async function() {
    const token = getAuthToken();
    if (!token || !profileIcon) return;
    
    const userData = await fetchCurrentUserData();
    if (userData) {
      updateProfileIconElement(profileIcon, userData);
    }
  };
}

/**
 * Initializes profile dropdown functionality
 */
async function initProfileDropdown() {
  const profileContainer = document.getElementById('profileContainer');
  if (!profileContainer) {
    return;
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    profileContainer.setAttribute('data-hidden', 'true');
    return;
  }
  
  // Show profile
  profileContainer.setAttribute('data-hidden', 'false');
  
  const profileIcon = profileContainer.querySelector('.profile-icon');
  const profileDropdown = profileContainer.querySelector('.profile-dropdown');
  
  // Fetch full user data to get profile picture
  const fullUserData = await fetchCurrentUserData();
  const userDataToDisplay = fullUserData || currentUser;
  updateProfileIconElement(profileIcon, userDataToDisplay);
  
  // Create global updater function
  createGlobalProfileIconUpdater(profileIcon);
  
  // Setup event listeners
  setupDropdownEventListeners(profileContainer, profileIcon, profileDropdown);
}

// ============================================================================
// Navigation Visibility Module (Single Responsibility: conditional UI display)
// ============================================================================

/**
 * Toggles registration link visibility based on authentication status
 */
function toggleRegistrationLink() {
  const currentUser = getCurrentUser();
  const registrationNavItem = document.getElementById('navRegister');
  
  if (!registrationNavItem) return;
  
  const registrationNavItemParent = registrationNavItem.closest('.navItem');
  if (!registrationNavItemParent) return;
  
  registrationNavItemParent.style.display = currentUser ? 'none' : '';
}

/**
 * Toggles sign-in links visibility based on authentication status
 */
function toggleSignInLinks() {
  const currentUser = getCurrentUser();
  const authToken = getAuthToken();
  const isAuthenticated = currentUser && authToken;
  
  // Hide/show hero section Sign In button
  const heroSignInLink = document.getElementById('heroSignInLink');
  if (heroSignInLink) {
    heroSignInLink.style.display = isAuthenticated ? 'none' : '';
  }
  
  // Hide/show sidebar Sign In link
  const sidebarSignInItem = document.getElementById('sidebarSignInItem');
  if (sidebarSignInItem) {
    sidebarSignInItem.style.display = isAuthenticated ? 'none' : '';
  }
}
