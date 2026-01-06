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
 * File: pages/scripts/dashboard.js
 * Description: Student Dashboard Module - Handles dynamic content for student dashboard page
 * 
 * Responsibilities:
 * - Load and display user enrollments
 * - Display statistics
 * - Load and display recommended events
 * - Calculate enrollment statistics
 */

const API_BASE_URL = 'http://localhost:3000/api';
const ENROLLMENT_API_URL = `${API_BASE_URL}/enrollments`;
const EVENT_API_URL = `${API_BASE_URL}/events`;

// ============================================================================
// Authentication Module (Single Responsibility: auth operations)
// ============================================================================

/**
 * Retrieves authentication token from localStorage
 * @returns {string|null} Authentication token or null
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Retrieves current user from localStorage
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Generates authentication headers for API requests
 * @returns {Object} Headers object with Authorization token
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
// Statistics Module (Single Responsibility: statistics calculation)
// ============================================================================

/**
 * Counts events by category
 * @param {Array} enrollments - Array of enrollment objects
 * @returns {Object} Counts by category
 */
function countEventsByCategory(enrollments) {
  return {
    workshops: enrollments.filter(e => e.event.category === 'workshop').length,
    seminars: enrollments.filter(e => e.event.category === 'seminar').length,
    networking: enrollments.filter(e => e.event.category === 'networking').length,
    summits: enrollments.filter(e => e.event.category === 'summit').length
  };
}

/**
 * Counts upcoming events (date >= today)
 * @param {Array} enrollments - Array of enrollment objects
 * @returns {number} Count of upcoming events
 */
function countUpcomingEvents(enrollments) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return enrollments.filter(enrollment => {
    const eventDate = new Date(enrollment.event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;
}

/**
 * Updates quick statistics display
 * @param {number} totalEvents - Total number of events
 * @param {number} completedEvents - Number of completed events
 * @param {number} upcomingEvents - Number of upcoming events
 */
function updateQuickStats(totalEvents, completedEvents, upcomingEvents) {
  const totalEventsElement = document.querySelector('#quickStats .stat-card:nth-child(1) .stat-value');
  if (totalEventsElement) {
    totalEventsElement.textContent = totalEvents;
  }
  
  const completedElement = document.querySelector('#quickStats .stat-card:nth-child(2) .stat-value');
  if (completedElement) {
    completedElement.textContent = completedEvents;
  }
  
  const inProgressElement = document.querySelector('#quickStats .stat-card:nth-child(3) .stat-value');
  if (inProgressElement) {
    inProgressElement.textContent = upcomingEvents;
  }
}

/**
 * Updates detailed statistics display
 * @param {number} totalEvents - Total number of events
 * @param {number} workshops - Number of workshops
 * @param {number} upcomingEvents - Number of upcoming events
 */
function updateDetailedStats(totalEvents, workshops, upcomingEvents) {
  const eventsAttendedElement = document.querySelector('#progress-statistics .stat-box:nth-child(1) .stat-number');
  if (eventsAttendedElement) {
    eventsAttendedElement.textContent = totalEvents;
  }
  
  const workshopsDoneElement = document.querySelector('#progress-statistics .stat-box:nth-child(3) .stat-number');
  if (workshopsDoneElement) {
    workshopsDoneElement.textContent = workshops;
  }
  
  const upcomingBookingsElement = document.querySelector('#progress-statistics .stat-box:nth-child(4) .stat-number');
  if (upcomingBookingsElement) {
    upcomingBookingsElement.textContent = upcomingEvents;
  }
}

/**
 * Updates all statistics displays
 * @param {Array} enrollments - Array of enrollment objects
 */
function updateStats(enrollments) {
  const totalEvents = enrollments.length;
  const categoryCounts = countEventsByCategory(enrollments);
  const upcomingEvents = countUpcomingEvents(enrollments);
  const completedEvents = totalEvents - upcomingEvents;
  
  updateQuickStats(totalEvents, completedEvents, upcomingEvents);
  updateDetailedStats(totalEvents, categoryCounts.workshops, upcomingEvents);
}

// ============================================================================
// Event Rendering Module (Single Responsibility: DOM manipulation)
// ============================================================================

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formats date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
function formatEventDate(dateString) {
  const eventDate = new Date(dateString);
  return eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Determines if event is upcoming or past
 * @param {string|Date} eventDate - Event date
 * @returns {boolean} True if event is upcoming
 */
function isEventUpcoming(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDateOnly = new Date(eventDate);
  eventDateOnly.setHours(0, 0, 0, 0);
  
  return eventDateOnly >= today;
}

/**
 * Gets image source for event card based on category and index
 * @param {string} category - Event category
 * @param {number} index - Event index in list
 * @returns {string} Image source path
 */
function getEventImageSource(category, index) {
  const categoryImagePools = {
    'workshop': ['images/study1.jpeg', 'images/machine learning.jpg', 'images/data analysis.jpg', 'images/security.jpg'],
    'seminar': ['images/study2.jpg', 'images/event-1.webp', 'images/event-2.jpg', 'images/data analysis.jpg'],
    'networking': ['images/event-1.webp', 'images/event-2.jpg', 'images/study1.jpeg', 'images/study2.jpg'],
    'summit': ['images/security.jpg', 'images/data analysis.jpg', 'images/machine learning.jpg', 'images/event-1.webp']
  };
  
  const allImages = [
    'images/study1.jpeg',
    'images/study2.jpg',
    'images/data analysis.jpg',
    'images/machine learning.jpg',
    'images/security.jpg',
    'images/event-1.webp',
    'images/event-2.jpg'
  ];
  
  const normalizedCategory = category?.toLowerCase() || 'workshop';
  const categoryImages = categoryImagePools[normalizedCategory];
  
  if (categoryImages && categoryImages.length > 0) {
    return categoryImages[index % categoryImages.length];
  }
  
  return allImages[index % allImages.length];
}

/**
 * Creates HTML for a single enrolled event card
 * @param {Object} enrollment - Enrollment object with event data
 * @param {number} index - Index in the list
 * @returns {string} HTML string for event card
 */
function createEventCardHTML(enrollment, index) {
  const event = enrollment.event;
  const formattedDate = formatEventDate(event.date);
  const isUpcoming = isEventUpcoming(event.date);
  const imageSrc = getEventImageSource(event.category, index);
  const categoryDisplay = event.category.charAt(0).toUpperCase() + event.category.slice(1);
  const statusHTML = isUpcoming 
    ? '<span style="color: green;">Upcoming</span>' 
    : '<span style="color: gray;">Completed</span>';
  
  return `
    <figure>
      <img src="${imageSrc}" alt="${escapeHtml(event.title)}" width="150">
    </figure>
    <div class="course-details">
      <h3>${escapeHtml(event.title)}</h3>
      <p><strong>Category:</strong> ${escapeHtml(categoryDisplay)}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Location:</strong> ${escapeHtml(event.location)}</p>
      <p><strong>Status:</strong> ${statusHTML}</p>
      <button type="button" class="continue-btn" onclick="window.location.href='events.html'">View Event</button>
    </div>
  `;
}

/**
 * Renders enrolled events in the dashboard
 * @param {Array} enrollments - Array of enrollment objects
 */
function renderEnrolledEvents(enrollments) {
  const enrolledCoursesSection = document.getElementById('enrolled-courses');
  if (!enrolledCoursesSection) return;
  
  // Remove existing course cards (keep the h2 title)
  const existingCards = enrolledCoursesSection.querySelectorAll('article.course-card');
  existingCards.forEach(card => card.remove());
  
  if (enrollments.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'You have not enrolled in any events yet. Browse events to get started!';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '2rem';
    emptyMessage.style.color = 'var(--color-text-secondary)';
    enrolledCoursesSection.appendChild(emptyMessage);
    return;
  }
  
  // Sort by enrollment date (newest first)
  const sortedEnrollments = [...enrollments].sort(
    (a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)
  );
  
  // Create course cards for each enrollment
  sortedEnrollments.forEach((enrollment, index) => {
    const article = document.createElement('article');
    article.className = 'course-card';
    article.innerHTML = createEventCardHTML(enrollment, index);
    enrolledCoursesSection.appendChild(article);
  });
}

// ============================================================================
// Recommended Events Module (Single Responsibility: recommended events)
// ============================================================================

/**
 * Renders recommended events in the sidebar
 * @param {Array} events - Array of event objects
 */
function renderRecommendedEvents(events) {
  const recommendedSection = document.getElementById('recommendedSection');
  if (!recommendedSection) return;
  
  const listElement = recommendedSection.querySelector('ul');
  if (!listElement) return;
  
  // Clear existing items
  listElement.innerHTML = '';
  
  if (events.length === 0) {
    const listItem = document.createElement('li');
    listItem.textContent = 'No events available';
    listItem.style.color = 'var(--color-text-secondary, #666)';
    listElement.appendChild(listItem);
    return;
  }
  
  // Create list items for each recommended event
  events.forEach(event => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = 'events.html';
    link.title = event.title;
    link.textContent = event.title;
    
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'events.html';
    });
    
    listItem.appendChild(link);
    listElement.appendChild(listItem);
  });
}

/**
 * Loads recommended events from API
 */
async function loadRecommendedEvents() {
  try {
    const response = await fetch(`${EVENT_API_URL}/random`);
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        renderRecommendedEvents(result.data);
        return;
      }
    }
    
    // Show fallback message if API fails
    renderRecommendedEvents([]);
  } catch (error) {
    console.error('Error loading recommended events:', error);
    renderRecommendedEvents([]);
  }
}

// ============================================================================
// Dashboard Data Loading Module (Single Responsibility: data fetching)
// ============================================================================

/**
 * Updates welcome message with user name
 * @param {string} userName - User's name
 */
function updateWelcomeMessage(userName) {
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = `Welcome back, ${userName}`;
  }
}

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
 * Fetches user enrollments from API
 * @returns {Promise<Array>} Array of enrollment objects
 */
async function fetchUserEnrollments() {
  try {
    const response = await fetch(`${ENROLLMENT_API_URL}/my-enrollments`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
    } else {
      handleAuthError(response.status);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
  
  return [];
}

/**
 * Loads and displays dashboard data
 */
async function loadDashboard() {
  if (!checkAuth()) return;
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  updateWelcomeMessage(currentUser.name);
  
  const enrollments = await fetchUserEnrollments();
  updateStats(enrollments);
  renderEnrolledEvents(enrollments);
  
  loadRecommendedEvents();
}

// ============================================================================
// Module Initialization
// ============================================================================

window.addEventListener('DOMContentLoaded', loadDashboard);
