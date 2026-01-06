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
 * File: pages/scripts/event-filter.js
 * Description: Event Filter and Management Module
 * Handles event filtering, enrollment, and admin event creation
 * 
 * Responsibilities:
 * - Event filtering and display
 * - User enrollment management
 * - Admin event creation
 * - Role-based UI visibility
 * - Dynamic event rendering
 */

const API_URL = 'http://localhost:3000/api/events';
const ENROLLMENT_API_URL = 'http://localhost:3000/api/enrollments';

// ============================================================================
// State Management Module (Single Responsibility: application state)
// ============================================================================

let allEvents = [];
let userEnrollments = [];
let currentUser = null;

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
 * Checks if current user is admin
 * @returns {boolean} True if user is admin
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
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

// ============================================================================
// DOM Element References Module (Single Responsibility: element access)
// ============================================================================

/**
 * Gets all required DOM elements
 * @returns {Object} Object containing all DOM element references
 */
function getDOMElements() {
  return {
    filterForm: document.getElementById('filterForm'),
    keywordInput: document.getElementById('keywordInput'),
    categorySelect: document.getElementById('categorySelect'),
    locationInput: document.getElementById('locationInput'),
    dateInput: document.getElementById('dateInput'),
    filterButton: document.getElementById('filterButton'),
    resetButton: document.getElementById('resetButton'),
    tableBody: document.getElementById('tableBody'),
    addEventButton: document.getElementById('addEventButton'),
    addEventModal: document.getElementById('addEventModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    addEventForm: document.getElementById('addEventForm'),
    formMessage: document.getElementById('formMessage'),
    submitEventBtn: document.getElementById('submitEventBtn')
  };
}

// ============================================================================
// Role-Based UI Module (Single Responsibility: UI visibility)
// ============================================================================

/**
 * Sets up role-based UI visibility
 */
function setupRoleBasedUI() {
  const elements = getDOMElements();
  currentUser = getCurrentUser();
  
  if (currentUser) {
    const shouldShowAddButton = isAdmin();
    if (elements.addEventButton) {
      elements.addEventButton.style.display = shouldShowAddButton ? 'block' : 'none';
    }
    
    if (!isAdmin()) {
      fetchUserEnrollments();
    }
  } else {
    if (elements.addEventButton) {
      elements.addEventButton.style.display = 'none';
    }
  }
}

// ============================================================================
// Enrollment Module (Single Responsibility: enrollment operations)
// ============================================================================

/**
 * Fetches user enrollments from API
 */
async function fetchUserEnrollments() {
  const token = getAuthToken();
  if (!token) return;
  
  try {
    const response = await fetch(`${ENROLLMENT_API_URL}/my-enrollments`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        userEnrollments = result.data.map(enrollment => 
          enrollment.event._id || enrollment.event
        );
        renderEvents(allEvents);
      }
    }
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
}

/**
 * Checks if user is enrolled in an event
 * @param {string} eventId - Event ID to check
 * @returns {boolean} True if enrolled
 */
function isEnrolled(eventId) {
  return userEnrollments.some(enrolledId => 
    String(enrolledId) === String(eventId)
  );
}

/**
 * Gets current user ID from localStorage
 * @returns {string|null} User ID
 */
function getCurrentUserId() {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user._id || null;
    }
  } catch (error) {
    return null;
  }
  return null;
}

/**
 * Stores enrolled event in localStorage for calculator
 * @param {Object} event - Event object to store
 */
function storeEventForCalculator(event) {
  const userId = getCurrentUserId();
  const storageKey = userId ? `calculatorEvents_${userId}` : 'calculatorEvents';
  
  let enrolledEvents = [];
  const storedEvents = localStorage.getItem(storageKey);
  if (storedEvents) {
    try {
      enrolledEvents = JSON.parse(storedEvents);
    } catch (error) {
      enrolledEvents = [];
    }
  }
  
  const enrolledEvent = {
    id: event._id || event.id,
    title: event.title,
    price: event.cost || 0,
    date: event.date,
    category: event.category
  };
  
  const exists = enrolledEvents.some(e => e.id === enrolledEvent.id);
  if (!exists) {
    enrolledEvents.push(enrolledEvent);
    localStorage.setItem(storageKey, JSON.stringify(enrolledEvents));
  }
}

/**
 * Enrolls user in an event
 * @param {string} eventId - Event ID to enroll in
 */
async function enrollInEvent(eventId) {
  const token = getAuthToken();
  if (!token) {
    alert('Please login to enroll in events');
    window.location.href = 'login.html';
    return;
  }
  
  try {
    // Fetch event details to get price
    const eventResponse = await fetch(`${API_URL}/${eventId}`);
    const eventResult = await eventResponse.json();
    
    if (!eventResult.success || !eventResult.data) {
      alert('Failed to fetch event details');
      return;
    }
    
    const event = eventResult.data;
    
    // Enroll in the event
    const response = await fetch(`${ENROLLMENT_API_URL}/events/${eventId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    const result = await response.json();
    
    if (result.success) {
      storeEventForCalculator(event);
      window.location.href = 'budget-calculator.html';
    } else {
      alert(result.message || 'Failed to enroll in event');
    }
  } catch (error) {
    console.error('Enrollment error:', error);
    alert('Failed to enroll in event. Please try again.');
  }
}

// ============================================================================
// Modal Management Module (Single Responsibility: modal operations)
// ============================================================================

/**
 * Opens the add event modal
 */
function openModal() {
  const elements = getDOMElements();
  const token = getAuthToken();
  
  if (!token || !isAdmin()) {
    alert('Please login as admin to add events');
    window.location.href = 'login.html';
    return;
  }
  
  if (elements.addEventModal) {
    elements.addEventModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Closes the add event modal
 */
function closeModal() {
  const elements = getDOMElements();
  
  if (elements.addEventModal) {
    elements.addEventModal.classList.remove('show');
    document.body.style.overflow = '';
    
    if (elements.addEventForm) {
      elements.addEventForm.reset();
    }
    
    if (elements.formMessage) {
      elements.formMessage.className = 'form-message';
      elements.formMessage.textContent = '';
    }
  }
}

/**
 * Sets up modal event listeners
 */
function setupModalListeners() {
  const elements = getDOMElements();
  
  if (elements.addEventButton) {
    elements.addEventButton.addEventListener('click', openModal);
  }
  
  if (elements.closeModalBtn) {
    elements.closeModalBtn.addEventListener('click', closeModal);
  }
  
  if (elements.cancelBtn) {
    elements.cancelBtn.addEventListener('click', closeModal);
  }
  
  if (elements.addEventModal) {
    elements.addEventModal.addEventListener('click', (event) => {
      if (event.target === elements.addEventModal) {
        closeModal();
      }
    });
  }
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.addEventModal?.classList.contains('show')) {
      closeModal();
    }
  });
}

// ============================================================================
// Event Creation Module (Single Responsibility: admin event creation)
// ============================================================================

/**
 * Extracts form data from add event form
 * @returns {Object} Form data object
 */
function extractEventFormData() {
  return {
    title: document.getElementById('eventTitleInput').value.trim(),
    description: document.getElementById('eventDescriptionInput').value.trim(),
    date: document.getElementById('eventDateInput').value,
    location: document.getElementById('eventLocationInput').value.trim(),
    category: document.getElementById('eventCategoryInput').value,
    cost: parseFloat(document.getElementById('eventCostInput').value) || 0
  };
}

/**
 * Handles successful event creation
 * @param {HTMLElement} formMessage - Message container element
 */
function handleEventCreationSuccess(formMessage) {
  if (formMessage) {
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Event added successfully!';
  }
  
  setTimeout(() => {
    closeModal();
    fetchEvents();
  }, 1500);
}

/**
 * Handles event creation error
 * @param {Object} result - API response result
 * @param {HTMLElement} formMessage - Message container element
 * @param {HTMLElement} submitButton - Submit button element
 */
function handleEventCreationError(result, formMessage, submitButton) {
  if (formMessage) {
    formMessage.className = 'form-message error';
    formMessage.textContent = result.message || 'Failed to add event. Please try again.';
  }
  
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Add Event';
  }
}

/**
 * Handles add event form submission
 */
function setupAddEventForm() {
  const elements = getDOMElements();
  if (!elements.addEventForm) return;
  
  elements.addEventForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (elements.formMessage) {
      elements.formMessage.className = 'form-message';
      elements.formMessage.textContent = '';
    }
    
    if (elements.submitEventBtn) {
      elements.submitEventBtn.disabled = true;
      elements.submitEventBtn.textContent = 'Adding...';
    }
    
    const formData = extractEventFormData();
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        handleEventCreationSuccess(elements.formMessage);
      } else {
        handleEventCreationError(result, elements.formMessage, elements.submitEventBtn);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      if (elements.formMessage) {
        elements.formMessage.className = 'form-message error';
        elements.formMessage.textContent = 'Failed to connect to server. Please make sure the server is running.';
      }
      if (elements.submitEventBtn) {
        elements.submitEventBtn.disabled = false;
        elements.submitEventBtn.textContent = 'Add Event';
      }
    }
  });
}

// ============================================================================
// Event Display Module (Single Responsibility: event rendering)
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
 * @param {string|Date} dateString - Date string
 * @returns {string} Formatted date
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
 * Formats cost for display
 * @param {number} cost - Event cost
 * @returns {string} Formatted cost string
 */
function formatCost(cost) {
  return (cost === 0 || cost === null) ? 'Free' : `$${cost}`;
}

/**
 * Creates action cell HTML based on user role and enrollment status
 * @param {Object} event - Event object
 * @returns {string} HTML string for action cell
 */
function createActionCell(event) {
  if (!currentUser) {
    return '<td><button type="button" class="enroll-btn" disabled title="Please login to enroll">Login to Enroll</button></td>';
  }
  
  if (isAdmin()) {
    return '<td></td>';
  }
  
  if (isEnrolled(event._id)) {
    return '<td><span style="color: green; font-weight: bold;">Enrolled</span></td>';
  }
  
  return `<td><button type="button" class="enroll-btn" data-event-id="${event._id}">Enroll</button></td>`;
}

/**
 * Creates table row HTML for an event
 * @param {Object} event - Event object
 * @returns {string} HTML string for table row
 */
function createEventRowHTML(event) {
  const formattedDate = formatEventDate(event.date);
  const costDisplay = formatCost(event.cost);
  const actionCell = createActionCell(event);
  
  return `
    <td>${escapeHtml(event.title)}</td>
    <td><time datetime="${event.date}">${formattedDate}</time></td>
    <td>${escapeHtml(event.location)}</td>
    <td>${costDisplay}</td>
    ${actionCell}
  `;
}

/**
 * Renders events in the table
 * @param {Array} events - Array of event objects
 */
function renderEvents(events) {
  const elements = getDOMElements();
  if (!elements.tableBody) return;
  
  elements.tableBody.innerHTML = '';
  
  if (events.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px;">No events found</td>';
    elements.tableBody.appendChild(emptyRow);
    return;
  }
  
  events.forEach(event => {
    const row = document.createElement('tr');
    row.setAttribute('data-category', event.category.toLowerCase());
    row.innerHTML = createEventRowHTML(event);
    elements.tableBody.appendChild(row);
  });
  
  // Add event listeners to enroll buttons
  const enrollButtons = elements.tableBody.querySelectorAll('.enroll-btn');
  enrollButtons.forEach(button => {
    button.addEventListener('click', function() {
      const eventId = this.getAttribute('data-event-id');
      enrollInEvent(eventId);
    });
  });
}

/**
 * Displays error message in table
 * @param {string} message - Error message
 */
function displayError(message) {
  const elements = getDOMElements();
  if (!elements.tableBody) return;
  
  elements.tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: red;">${message}</td></tr>`;
}

// ============================================================================
// Event Filtering Module (Single Responsibility: event filtering)
// ============================================================================

/**
 * Checks if event matches keyword filter
 * @param {Object} event - Event object
 * @param {string} keyword - Search keyword
 * @returns {boolean} True if matches
 */
function matchesKeyword(event, keyword) {
  if (keyword === '') return true;
  
  const lowerKeyword = keyword.toLowerCase();
  return event.title.toLowerCase().includes(lowerKeyword) ||
         event.description.toLowerCase().includes(lowerKeyword);
}

/**
 * Checks if event matches category filter
 * @param {Object} event - Event object
 * @param {string} category - Category filter
 * @returns {boolean} True if matches
 */
function matchesCategory(event, category) {
  return category === 'all' || category === '' || 
         event.category.toLowerCase() === category;
}

/**
 * Checks if event matches location filter
 * @param {Object} event - Event object
 * @param {string} location - Location filter
 * @returns {boolean} True if matches
 */
function matchesLocation(event, location) {
  if (location === '') return true;
  return event.location.toLowerCase().includes(location.toLowerCase());
}

/**
 * Checks if event matches date filter
 * @param {Object} event - Event object
 * @param {string} selectedDate - Selected date filter
 * @returns {boolean} True if matches
 */
function matchesDate(event, selectedDate) {
  if (selectedDate === '') return true;
  
  const eventDate = new Date(event.date);
  const eventDateString = eventDate.toISOString().split('T')[0];
  return eventDateString === selectedDate;
}

/**
 * Filters events based on current filter values
 */
function filterEvents() {
  const elements = getDOMElements();
  
  const keyword = elements.keywordInput.value.toLowerCase().trim();
  const category = elements.categorySelect.value.toLowerCase();
  const location = elements.locationInput.value.toLowerCase().trim();
  const selectedDate = elements.dateInput.value;
  
  const filteredEvents = allEvents.filter(event => {
    return matchesKeyword(event, keyword) &&
           matchesCategory(event, category) &&
           matchesLocation(event, location) &&
           matchesDate(event, selectedDate);
  });
  
  renderEvents(filteredEvents);
}

/**
 * Resets all filters and displays all events
 */
function resetFilters() {
  const elements = getDOMElements();
  
  elements.keywordInput.value = '';
  elements.categorySelect.value = 'all';
  elements.locationInput.value = '';
  elements.dateInput.value = '';
  
  renderEvents(allEvents);
}

/**
 * Sets up filter form event listeners
 */
function setupFilterListeners() {
  const elements = getDOMElements();
  
  if (elements.filterButton) {
    elements.filterButton.addEventListener('click', (event) => {
      event.preventDefault();
      filterEvents();
    });
  }
  
  if (elements.resetButton) {
    elements.resetButton.addEventListener('click', (event) => {
      event.preventDefault();
      resetFilters();
    });
  }
}

// ============================================================================
// Event Data Loading Module (Single Responsibility: data fetching)
// ============================================================================

/**
 * Fetches all events from API
 */
async function fetchEvents() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    if (result.success) {
      allEvents = result.data;
      renderEvents(allEvents);
    } else {
      console.error('Error fetching events:', result.message);
      displayError('Failed to load events. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    displayError('Failed to connect to server. Please make sure the server is running.');
  }
}

// ============================================================================
// Module Initialization
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  setupRoleBasedUI();
  setupModalListeners();
  setupAddEventForm();
  setupFilterListeners();
  fetchEvents();
});
