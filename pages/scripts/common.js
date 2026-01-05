// File: scripts/common.js
// Shared JavaScript utilities used across all pages

document.addEventListener('DOMContentLoaded', () => {
  updateCopyrightYear();
  setActiveNavLink();
  enableSmoothScroll();
  secureExternalLinks();
  initProfileDropdown();
  toggleRegistrationLink();
});

/* Update copyright year automatically */
function updateCopyrightYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = year;
  });
}

/* Highlight active navigation link */
function setActiveNavLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navLink').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });
}

/* Smooth scrolling for anchor links */
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* Add security attributes to external links */
function secureExternalLinks() {
  const host = location.hostname;

  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(host)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

/* Profile Dropdown Functions */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

function signOut() {
  clearAuth();
  window.location.href = 'login.html';
}

function switchAccount() {
  clearAuth();
  window.location.href = 'login.html';
}

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/* Update Profile Icon */
function updateProfileIconElement(profileIcon, userData) {
  if (!profileIcon) return;
  
  // Clear existing content
  profileIcon.textContent = '';
  profileIcon.classList.remove('has-image');
  
  // Remove existing image if any
  const existingImg = profileIcon.querySelector('img');
  if (existingImg) {
    existingImg.remove();
  }
  
  // If user has profile picture, show image
  if (userData && userData.profilePicture) {
    const img = document.createElement('img');
    img.src = userData.profilePicture;
    img.alt = 'Profile Picture';
    profileIcon.appendChild(img);
    profileIcon.classList.add('has-image');
  } else {
    // Show initials
    profileIcon.textContent = getInitials(userData?.name || 'U');
  }
}

/* Initialize Profile Dropdown */
async function initProfileDropdown() {
  const user = getCurrentUser();
  const profileContainer = document.getElementById('profileContainer');
  
  if (!profileContainer) return;
  
  if (!user) {
    profileContainer.setAttribute('data-hidden', 'true');
    return;
  }
  
  // Show profile
  profileContainer.setAttribute('data-hidden', 'false');
  
  const profileIcon = profileContainer.querySelector('.profile-icon');
  const profileDropdown = profileContainer.querySelector('.profile-dropdown');
  const profileBtn = profileContainer.querySelector('[data-action="profile"]');
  const switchAccountBtn = profileContainer.querySelector('[data-action="switch"]');
  
  // Fetch full user data to get profile picture
  try {
    const token = getAuthToken();
    if (token) {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const fullUserData = result.data;
          updateProfileIconElement(profileIcon, fullUserData);
        } else {
          // Fallback to initials if API fails
          updateProfileIconElement(profileIcon, user);
        }
      } else {
        // Fallback to initials if API fails
        updateProfileIconElement(profileIcon, user);
      }
    } else {
      // Fallback to initials if no token
      updateProfileIconElement(profileIcon, user);
    }
  } catch (error) {
    console.error('Error fetching user data for profile icon:', error);
    // Fallback to initials on error
    updateProfileIconElement(profileIcon, user);
  }
  
  // Create global function to update profile icon (called from profile page)
  window.updateProfileIcon = async function() {
    const token = getAuthToken();
    if (!token || !profileIcon) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          updateProfileIconElement(profileIcon, result.data);
        }
      }
    } catch (error) {
      console.error('Error updating profile icon:', error);
    }
  };
  
  // Toggle dropdown
  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileContainer.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }
  
  // Handle profile link
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'profile.html';
    });
  }
  
  // Handle switch account
  if (switchAccountBtn) {
    switchAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchAccount();
    });
  }
}

/* Toggle Registration Link - Hide when logged in */
function toggleRegistrationLink() {
  const user = getCurrentUser();
  const registrationNavItem = document.getElementById('navRegister');
  
  if (!registrationNavItem) return;
  
  // Find the parent <li> element
  const registrationNavItemParent = registrationNavItem.closest('.navItem');
  
  if (!registrationNavItemParent) return;
  
  if (user) {
    // Hide registration link when logged in
    registrationNavItemParent.style.display = 'none';
  } else {
    // Show registration link when not logged in
    registrationNavItemParent.style.display = '';
  }
}
