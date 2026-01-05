/**
 * Budget Calculator Module
 * Handles event budget calculations including tickets, transportation, and accommodation
 * 
 * Responsibilities:
 * - Load and display enrolled events
 * - Calculate transportation costs based on governorate
 * - Calculate total budget
 * - Manage event removal
 */

(() => {
  "use strict";

  const API_URL = 'http://localhost:3000/api/events';
  
  const DISTANCE_TO_CAPITAL_KM = {
    Cairo: 0,
    Giza: 20,
    Alexandria: 220,
    "Port Said": 200,
    Suez: 140,
    Ismailia: 120,
    Sharqia: 80,
    Dakahlia: 150,
    Gharbia: 120,
    "Kafr El Sheikh": 200,
    Beheira: 180,
    Minya: 250,
    Assiut: 375,
    Sohag: 460,
    Qena: 600,
    Luxor: 670,
    Aswan: 880,
  };

  let enrolledEvents = [];

  // ============================================================================
  // Utility Functions Module (Single Responsibility: helper functions)
  // ============================================================================

  /**
   * Converts value to integer with default fallback
   * @param {number|string} value - Value to convert
   * @param {number} defaultValue - Default value if conversion fails
   * @returns {number} Integer value
   */
  function toInteger(value, defaultValue = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? Math.trunc(num) : defaultValue;
  }

  /**
   * Formats number as currency with 2 decimal places
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  function formatCurrency(amount) {
    return `$${Number(amount).toFixed(2)}`;
  }

  /**
   * Formats number as currency with integer suffix
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string with $ suffix
   */
  function formatCurrencyInteger(amount) {
    return `${Math.round(Number(amount))}$`;
  }

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

  // ============================================================================
  // Transportation Calculation Module (Single Responsibility: transport costs)
  // ============================================================================

  /**
   * Calculates transportation price based on governorate
   * Formula: price = 5 + 0.01 * distance
   * @param {string} governorate - Governorate name
   * @returns {number} Transportation price (rounded integer)
   */
  function calculateTransportPrice(governorate) {
    const normalizedGovernorate = String(governorate || "").trim();
    const distanceKm = DISTANCE_TO_CAPITAL_KM[normalizedGovernorate] ?? 0;
    return Math.round(5 + 0.01 * distanceKm);
  }

  // ============================================================================
  // User Storage Module (Single Responsibility: localStorage operations)
  // ============================================================================

  /**
   * Gets current user ID from localStorage
   * @returns {string|null} User ID or null
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
   * Gets storage key for calculator events (per user)
   * @returns {string} Storage key
   */
  function getCalculatorStorageKey() {
    const userId = getCurrentUserId();
    return userId ? `calculatorEvents_${userId}` : 'calculatorEvents';
  }

  /**
   * Clears old calculator data if user changed
   */
  function clearOldCalculatorData() {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      const oldEvents = localStorage.getItem('calculatorEvents');
      if (oldEvents) {
        localStorage.removeItem('calculatorEvents');
      }
    }
  }

  // ============================================================================
  // Event Management Module (Single Responsibility: event operations)
  // ============================================================================

  /**
   * Loads enrolled events from localStorage (per user)
   */
  function loadEnrolledEvents() {
    const storageKey = getCalculatorStorageKey();
    const storedEvents = localStorage.getItem(storageKey);
    
    if (storedEvents) {
      try {
        enrolledEvents = JSON.parse(storedEvents);
      } catch (error) {
        enrolledEvents = [];
      }
    } else {
      enrolledEvents = [];
    }
    
    renderEnrolledEvents();
    updateTicketsTotal();
  }

  /**
   * Removes event from enrolled events list
   * @param {number} index - Index of event to remove
   */
  function removeEvent(index) {
    enrolledEvents.splice(index, 1);
    const storageKey = getCalculatorStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(enrolledEvents));
    renderEnrolledEvents();
    updateTicketsTotal();
    updateTotal();
  }

  /**
   * Renders enrolled events list in the DOM
   */
  function renderEnrolledEvents() {
    const eventsList = document.querySelector("#enrolledEventsList");
    if (!eventsList) return;

    eventsList.innerHTML = '';

    if (enrolledEvents.length === 0) {
      eventsList.innerHTML = '<p style="color: #666; font-style: italic;">No events enrolled yet. Enroll in events to see them here.</p>';
      return;
    }

    enrolledEvents.forEach((event, index) => {
      const eventDiv = document.createElement('div');
      eventDiv.style.cssText = 'padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;';
      
      const eventInfo = document.createElement('div');
      eventInfo.innerHTML = `
        <strong>${escapeHtml(event.title)}</strong><br>
        <small style="color: #666;">Price: ${formatCurrency(event.price)}</small>
      `;
      
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'actionBtn';
      removeBtn.style.cssText = 'padding: 5px 10px; font-size: 12px;';
      removeBtn.onclick = () => removeEvent(index);
      
      eventDiv.appendChild(eventInfo);
      eventDiv.appendChild(removeBtn);
      eventsList.appendChild(eventDiv);
    });
  }

  // ============================================================================
  // Calculation Module (Single Responsibility: budget calculations)
  // ============================================================================

  /**
   * Updates tickets total (sum of all enrolled events)
   */
  function updateTicketsTotal() {
    const ticketsTotalField = document.querySelector("#ticketsTotalField");
    if (!ticketsTotalField) return;

    const total = enrolledEvents.reduce((sum, event) => sum + (event.price || 0), 0);
    ticketsTotalField.value = `Total: ${formatCurrency(total)}`;
  }

  /**
   * Updates total budget calculation
   * @param {HTMLElement} foodCostInput - Food cost input element
   * @param {HTMLElement} useTransportYes - Transport yes radio button
   * @param {HTMLElement} fromGovernorateSelect - Governorate select element
   */
  function updateTotal(foodCostInput, useTransportYes, fromGovernorateSelect) {
    const ticketsTotal = enrolledEvents.reduce((sum, event) => sum + (event.price || 0), 0);
    const accommodation = Math.max(0, Number(foodCostInput?.value || 0));
    const useTransport = !!useTransportYes?.checked;
    const transportCost = useTransport ? calculateTransportPrice(fromGovernorateSelect?.value) : 0;
    const total = ticketsTotal + accommodation + transportCost;

    const grandTotalField = document.querySelector("#grandTotalField");
    const grandTotalSpan = document.querySelector("#grandTotal");
    
    if (grandTotalField) {
      grandTotalField.value = formatCurrency(total);
    }
    if (grandTotalSpan) {
      grandTotalSpan.textContent = formatCurrency(total);
    }
  }

  /**
   * Updates inline calculations (transport, accommodation, totals)
   * @param {HTMLElement} foodCostInput - Food cost input element
   * @param {HTMLElement} useTransportYes - Transport yes radio button
   * @param {HTMLElement} useTransportNo - Transport no radio button
   * @param {HTMLElement} fromGovernorateSelect - Governorate select element
   * @param {HTMLElement} transportCostInput - Transport cost input element
   * @param {HTMLElement} accommodationTotalSpan - Accommodation total span element
   */
  function updateInline(
    foodCostInput,
    useTransportYes,
    useTransportNo,
    fromGovernorateSelect,
    transportCostInput,
    accommodationTotalSpan
  ) {
    updateTicketsTotal();

    const accommodation = Math.max(0, Number(foodCostInput?.value || 0));
    if (accommodationTotalSpan) {
      accommodationTotalSpan.textContent = formatCurrency(accommodation);
    }

    const useTransport = !!useTransportYes?.checked;
    if (fromGovernorateSelect) {
      fromGovernorateSelect.disabled = !useTransport;
    }

    const transportCost = useTransport ? calculateTransportPrice(fromGovernorateSelect?.value) : 0;
    if (transportCostInput) {
      transportCostInput.value = formatCurrencyInteger(transportCost);
    }
    
    updateTotal(foodCostInput, useTransportYes, fromGovernorateSelect);
  }

  // ============================================================================
  // Navigation Module (Single Responsibility: page navigation)
  // ============================================================================

  /**
   * Redirects to events page to add more events
   */
  function redirectToAddMoreEvents() {
    window.location.href = 'events.html';
  }

  // ============================================================================
  // Form Handling Module (Single Responsibility: form operations)
  // ============================================================================

  /**
   * Handles form submission
   * @param {Event} event - Form submit event
   * @param {HTMLElement} resultsBox - Results box element
   * @param {HTMLElement} foodCostInput - Food cost input element
   * @param {HTMLElement} useTransportYes - Transport yes radio button
   * @param {HTMLElement} fromGovernorateSelect - Governorate select element
   */
  function handleFormSubmit(event, resultsBox, foodCostInput, useTransportYes, fromGovernorateSelect) {
    event.preventDefault();
    updateTotal(foodCostInput, useTransportYes, fromGovernorateSelect);
    if (resultsBox) {
      resultsBox.hidden = false;
    }
  }

  /**
   * Handles form reset
   * @param {HTMLElement} resultsBox - Results box element
   * @param {HTMLElement} grandTotalField - Grand total field element
   * @param {Function} updateInlineCallback - Callback to update inline calculations
   */
  function handleFormReset(resultsBox, grandTotalField, updateInlineCallback) {
    setTimeout(() => {
      if (resultsBox) {
        resultsBox.hidden = true;
      }
      if (grandTotalField) {
        grandTotalField.value = "$0.00";
      }
      updateInlineCallback();
    }, 0);
  }

  // ============================================================================
  // Module Initialization
  // ============================================================================

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#budgetForm");
    if (!form) return;

    const ticketsTotalField = document.querySelector("#ticketsTotalField");
    const useTransportYes = document.querySelector("#useTransportYes");
    const useTransportNo = document.querySelector("#useTransportNo");
    const fromGovernorate = document.querySelector("#fromGovernorate");
    const transportCost = document.querySelector("#transportCost");
    const foodCost = document.querySelector("#foodCost");
    const accommodationTotal = document.querySelector("#accommodationTotal");
    const grandTotalField = document.querySelector("#grandTotalField");
    const grandTotalSpan = document.querySelector("#grandTotal");
    const resultsBox = document.querySelector("#budgetResults");
    const addMoreEventsBtn = document.querySelector("#addMoreEventsBtn");

    // Clear old calculator data if user changed
    clearOldCalculatorData();

    // Load enrolled events on page load (per user)
    loadEnrolledEvents();

    // Add more events button
    if (addMoreEventsBtn) {
      addMoreEventsBtn.addEventListener('click', redirectToAddMoreEvents);
    }

    // Create update inline callback with current elements
    const updateInlineCallback = () => {
      updateInline(
        foodCost,
        useTransportYes,
        useTransportNo,
        fromGovernorate,
        transportCost,
        accommodationTotal
      );
    };

    // Event listeners for real-time updates
    foodCost?.addEventListener("change", updateInlineCallback);
    useTransportYes?.addEventListener("change", updateInlineCallback);
    useTransportNo?.addEventListener("change", updateInlineCallback);
    fromGovernorate?.addEventListener("change", updateInlineCallback);

    // Form submission
    form.addEventListener("submit", (event) => {
      handleFormSubmit(
        event,
        resultsBox,
        foodCost,
        useTransportYes,
        fromGovernorate
      );
    });

    // Form reset
    form.addEventListener("reset", () => {
      handleFormReset(resultsBox, grandTotalField, updateInlineCallback);
    });

    // Initial calculation
    updateInlineCallback();
  });
})();
