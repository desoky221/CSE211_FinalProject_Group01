// Dashboard Script - Makes student dashboard dynamic
const API_URL = 'http://localhost:3000/api';
const ENROLLMENT_API_URL = `${API_URL}/enrollments`;
const AUTH_API_URL = `${API_URL}/auth`;

// Get auth token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Get auth headers
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Check authentication
function checkAuth() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Load user data and enrollments
async function loadDashboard() {
  if (!checkAuth()) return;
  
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // Update welcome message
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = `Welcome back, ${user.name}`;
  }
  
  // Load user enrollments
  try {
    const response = await fetch(`${ENROLLMENT_API_URL}/my-enrollments`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const enrollments = result.data;
        updateStats(enrollments);
        renderEnrolledEvents(enrollments);
      }
    } else if (response.status === 401) {
      // Token expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Update statistics
function updateStats(enrollments) {
  const totalEvents = enrollments.length;
  
  // Count by category
  const workshops = enrollments.filter(e => e.event.category === 'workshop').length;
  const seminars = enrollments.filter(e => e.event.category === 'seminar').length;
  const networking = enrollments.filter(e => e.event.category === 'networking').length;
  const summits = enrollments.filter(e => e.event.category === 'summit').length;
  
  // Count upcoming events (date >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = enrollments.filter(e => {
    const eventDate = new Date(e.event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;
  
  // Update quick stats
  const totalEventsEl = document.querySelector('#quickStats .stat-card:nth-child(1) .stat-value');
  if (totalEventsEl) {
    totalEventsEl.textContent = totalEvents;
  }
  
  const completedEl = document.querySelector('#quickStats .stat-card:nth-child(2) .stat-value');
  if (completedEl) {
    completedEl.textContent = totalEvents - upcomingEvents;
  }
  
  const inProgressEl = document.querySelector('#quickStats .stat-card:nth-child(3) .stat-value');
  if (inProgressEl) {
    inProgressEl.textContent = upcomingEvents;
  }
  
  // Update detailed stats
  const eventsAttendedEl = document.querySelector('#progress-statistics .stat-box:nth-child(1) .stat-number');
  if (eventsAttendedEl) {
    eventsAttendedEl.textContent = totalEvents;
  }
  
  const workshopsDoneEl = document.querySelector('#progress-statistics .stat-box:nth-child(3) .stat-number');
  if (workshopsDoneEl) {
    workshopsDoneEl.textContent = workshops;
  }
  
  const upcomingBookingsEl = document.querySelector('#progress-statistics .stat-box:nth-child(4) .stat-number');
  if (upcomingBookingsEl) {
    upcomingBookingsEl.textContent = upcomingEvents;
  }
}

// Render enrolled events
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
  enrollments.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
  
  // Create course cards for each enrollment
  enrollments.forEach(enrollment => {
    const event = enrollment.event;
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Check if event is upcoming or past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateOnly = new Date(eventDate);
    eventDateOnly.setHours(0, 0, 0, 0);
    const isUpcoming = eventDateOnly >= today;
    
    // Create article element
    const article = document.createElement('article');
    article.className = 'course-card';
    
    // Get image based on category (or use default)
    let imageSrc = 'images/study1.jpeg';
    if (event.category === 'workshop') {
      imageSrc = 'images/study1.jpeg';
    } else if (event.category === 'seminar') {
      imageSrc = 'images/study2.jpg';
    } else {
      imageSrc = 'images/study1.jpeg';
    }
    
    article.innerHTML = `
      <figure>
        <img src="${imageSrc}" alt="${event.title}" width="150">
      </figure>
      <div class="course-details">
        <h3>${escapeHtml(event.title)}</h3>
        <p><strong>Category:</strong> ${escapeHtml(event.category.charAt(0).toUpperCase() + event.category.slice(1))}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Location:</strong> ${escapeHtml(event.location)}</p>
        <p><strong>Status:</strong> ${isUpcoming ? '<span style="color: green;">Upcoming</span>' : '<span style="color: gray;">Completed</span>'}</p>
        <button type="button" class="continue-btn" onclick="window.location.href='events.html'">View Event</button>
      </div>
    `;
    
    enrolledCoursesSection.appendChild(article);
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize dashboard when page loads
window.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
});

