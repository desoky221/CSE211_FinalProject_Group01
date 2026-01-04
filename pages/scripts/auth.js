// Authentication helper functions
const API_URL = 'http://localhost:3000/api/auth';

// Store token in localStorage
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Get token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Get current user info
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Set current user info
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Clear auth data
function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Get auth headers for API requests
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Handle login form submission
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    messageDiv.style.display = 'none';
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store token and user info
        setAuthToken(result.data.token);
        setCurrentUser(result.data.user);
        
        // Show success message
        messageDiv.className = 'form-message success';
        messageDiv.textContent = 'Login successful! Redirecting...';
        messageDiv.style.display = 'block';
        
        // Redirect based on role
        setTimeout(() => {
          if (result.data.user.role === 'admin') {
            window.location.href = 'events.html';
          } else {
            window.location.href = 'student-dashboard.html';
          }
        }, 1000);
      } else {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = result.message || 'Login failed. Please check your credentials.';
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In →';
      }
    } catch (error) {
      console.error('Login error:', error);
      messageDiv.className = 'form-message error';
      messageDiv.textContent = 'Failed to connect to server. Please try again.';
      messageDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In →';
    }
  });
}

// Handle signup form submission (registration.html)
if (document.getElementById('registrationForm')) {
  document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.querySelector('input[type="text"]').value.trim(),
      email: document.querySelector('input[type="email"]').value.trim(),
      password: document.querySelector('input[type="password"]').value,
      governorate: document.querySelector('select[name="governorate"]').value
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Creating account...';
    
    // Create message div if it doesn't exist
    let messageDiv = document.getElementById('signupMessage');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = 'signupMessage';
      messageDiv.className = 'form-message';
      e.target.insertBefore(messageDiv, submitBtn);
    }
    messageDiv.style.display = 'none';
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store token and user info
        setAuthToken(result.data.token);
        setCurrentUser(result.data.user);
        
        messageDiv.className = 'form-message success';
        messageDiv.textContent = 'Account created successfully! Redirecting...';
        messageDiv.style.display = 'block';
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'student-dashboard.html';
        }, 1000);
      } else {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = result.message || 'Registration failed. Please try again.';
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } catch (error) {
      console.error('Registration error:', error);
      messageDiv.className = 'form-message error';
      messageDiv.textContent = 'Failed to connect to server. Please try again.';
      messageDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

