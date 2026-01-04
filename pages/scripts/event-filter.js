window.addEventListener('DOMContentLoaded', function() {    
    
  var filterForm = document.getElementById('filterForm');
  var keywordInput = document.getElementById('keywordInput');
  var categorySelect = document.getElementById('categorySelect');
  var locationInput = document.getElementById('locationInput');
  var dateInput = document.getElementById('dateInput');
  var filterButton = document.getElementById('filterButton');
  var resetButton = document.getElementById('resetButton');
  var tableBody = document.getElementById('tableBody');
  
  const API_URL = 'http://localhost:3000/api/events';
  
  var allEvents = [];
  
  var addEventButton = document.getElementById('addEventButton');
  var addEventModal = document.getElementById('addEventModal');
  var closeModalBtn = document.getElementById('closeModalBtn');
  var cancelBtn = document.getElementById('cancelBtn');
  var addEventForm = document.getElementById('addEventForm');
  var formMessage = document.getElementById('formMessage');
  var submitEventBtn = document.getElementById('submitEventBtn');
  
  
  function openModal() {
    addEventModal.classList.add('show');
    document.body.style.overflow = 'hidden'; 
  }
  
  function closeModal() {
    addEventModal.classList.remove('show');
    document.body.style.overflow = ''; 
    addEventForm.reset();
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }
  

  if (addEventButton) {
    addEventButton.addEventListener('click', openModal);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  
  if (addEventModal) {
    addEventModal.addEventListener('click', function(event) {
      if (event.target === addEventModal) {
        closeModal();
      }
    });
  }
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && addEventModal.classList.contains('show')) {
      closeModal();
    }
  });
  
  
  
  if (addEventForm) {
    addEventForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      formMessage.className = 'form-message';
      formMessage.textContent = '';
      
      submitEventBtn.disabled = true;
      submitEventBtn.textContent = 'Adding...';
      
      var formData = {
        title: document.getElementById('eventTitleInput').value.trim(),
        description: document.getElementById('eventDescriptionInput').value.trim(),
        date: document.getElementById('eventDateInput').value,
        location: document.getElementById('eventLocationInput').value.trim(),
        category: document.getElementById('eventCategoryInput').value,
        cost: parseFloat(document.getElementById('eventCostInput').value) || 0
      };
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          formMessage.className = 'form-message success';
          formMessage.textContent = 'Event added successfully!';
          
          setTimeout(function() {
            closeModal();
            fetchEvents();
          }, 1500);
        } else {
          formMessage.className = 'form-message error';
          formMessage.textContent = result.message || 'Failed to add event. Please try again.';
          submitEventBtn.disabled = false;
          submitEventBtn.textContent = 'Add Event';
        }
      } catch (error) {
        console.error('Error adding event:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Failed to connect to server. Please make sure the server is running.';
        submitEventBtn.disabled = false;
        submitEventBtn.textContent = 'Add Event';
      }
    });
  }
  
  
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
  
  function renderEvents(events) {
    tableBody.innerHTML = '';
    
    if (events.length === 0) {
      var emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="4" style="text-align: center; padding: 20px;">No events found</td>';
      tableBody.appendChild(emptyRow);
      return;
    }
    
    events.forEach(event => {
      var row = document.createElement('tr');
      row.setAttribute('data-category', event.category.toLowerCase());
      
      var eventDate = new Date(event.date);
      var formattedDate = eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      var costDisplay = event.cost === 0 || event.cost === null ? 'Free' : '$' + event.cost;
      
      row.innerHTML = `
        <td>${escapeHtml(event.title)}</td>
        <td><time datetime="${event.date}">${formattedDate}</time></td>
        <td>${escapeHtml(event.location)}</td>
        <td>${costDisplay}</td>
      `;
      
      tableBody.appendChild(row);
    });
  }
  
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function displayError(message) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">${message}</td></tr>`;
  }
  
  function filterEvents() {
    var keyword = keywordInput.value.toLowerCase().trim();
    var category = categorySelect.value.toLowerCase();
    var location = locationInput.value.toLowerCase().trim();
    var selectedDate = dateInput.value;
    
    var filteredEvents = allEvents.filter(event => {
      var matchesKeyword = keyword === '' || 
        event.title.toLowerCase().indexOf(keyword) !== -1 ||
        event.description.toLowerCase().indexOf(keyword) !== -1;
      
      var matchesCategory = category === 'all' || category === '' || 
        event.category.toLowerCase() === category;
      
      var matchesLocation = location === '' || 
        event.location.toLowerCase().indexOf(location) !== -1;
      
      var matchesDate = true;
      if (selectedDate !== '') {
        var eventDate = new Date(event.date);
        var eventDateString = eventDate.toISOString().split('T')[0];
        matchesDate = eventDateString === selectedDate;
      }
      
      return matchesKeyword && matchesCategory && matchesLocation && matchesDate;
    });
    
    renderEvents(filteredEvents);
  }
  
  function resetFilters() {
    keywordInput.value = '';
    categorySelect.value = 'all';
    locationInput.value = '';
    dateInput.value = '';
    
    renderEvents(allEvents);
  }
  
  if (filterButton) {
    filterButton.addEventListener('click', function(event) {
      event.preventDefault();
      filterEvents();
    });
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', function(event) {
      event.preventDefault();
      resetFilters();
    });
  }
  
  fetchEvents();
});
